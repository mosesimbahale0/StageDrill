import os
import re
import sys
import questionary
from pathlib import Path
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# ==========================================
# 1. USER CONFIGURATION (PASTE SCHEMA HERE)
# ==========================================

# 1. The Name of the Entity (e.g. "Product", "User", "Order")
ENTITY_NAME = "Like"

# 2. The Schema Definition
# Format: "field_name": { "type": "String", "required": True, "is_array": False, "ref": "User" }
# Supported Types: "String", "Number", "Boolean", "Date", "ObjectId"

# 1. Schema Configuration for "Like"
SCHEMA_CONFIG = {
    "_customer_id": { "type": "ObjectId", "ref": "Customer", "required": True },
    "_product_id":  { "type": "ObjectId", "ref": "Product", "required": True },
    # Note: timestamps: true in Mongoose automatically adds createdAt and updatedAt
    # Note: The unique compound index on (_customer_id, _product_id) ensures 1 like per user per product
}

# 2. Features to Enable
FEATURES = [
    "CRUD",
    "Pagination",
    "Filter", # Useful for finding all likes by a user or for a product
    "Sort",
    "Subscription", 
]
# ==========================================
# 2. SYSTEM UTILS (DO NOT EDIT BELOW)
# ==========================================

if len(sys.argv) > 1:
    BASE_DIR = Path(sys.argv[1]).resolve()
else:
    BASE_DIR = Path.cwd()

SRC_DIR = BASE_DIR / 'src'
print(f"{Fore.MAGENTA}📂 Target Project Root: {BASE_DIR}")

PATHS = {
    'models': SRC_DIR / 'models',
    'resolvers': SRC_DIR / 'resolvers',
    'schemas': SRC_DIR / 'schemas',
    'types': SRC_DIR / 'types',
    'utils': SRC_DIR / 'utils',
}

class Utils:
    @staticmethod
    def capitalize(s):
        return s[0].upper() + s[1:] if s else s

    @staticmethod
    def camel_case(s):
        s = re.sub(r"(_|-)+", " ", s).title().replace(" ", "")
        return s[0].lower() + s[1:] if s else s

    @staticmethod
    def pascal_case(s):
        return Utils.capitalize(Utils.camel_case(s))

    @staticmethod
    def pluralize(s):
        return s if s.endswith('s') else s + 's'

    @staticmethod
    def ensure_dirs():
        for p in PATHS.values():
            if not p.exists():
                p.mkdir(parents=True, exist_ok=True)

class Scaffolder:
    def __init__(self, entity_name, fields, options):
        self.entity_raw = entity_name
        self.pascal = Utils.pascal_case(entity_name)
        self.camel = Utils.camel_case(entity_name)
        self.plural = Utils.pluralize(self.camel)
        self.plural_pascal = Utils.pluralize(self.pascal)
        self.fields = fields
        self.options = options

    def has_opt(self, opt):
        return opt in self.options

    def run(self):
        print(f"\n{Fore.CYAN}--- Starting Auto-Scaffold for {self.pascal} ---")
        Utils.ensure_dirs()
        self.create_mongoose_model()
        self.update_models_types()
        self.update_graphql_types()
        self.update_typedefs()
        self.create_resolvers()
        self.update_resolver_index()
        self.update_loaders()
        print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ All tasks completed successfully for {self.pascal}!")

    # 1. Mongoose Model
    def create_mongoose_model(self):
        file_path = PATHS['models'] / f"{self.camel}.model.ts"
        schema_fields = []
        for f in self.fields:
            line = ""
            is_array = f.get('is_array', False)
            type_def = ""
            
            if f['type'] == 'ObjectId':
                type_def = f"type: Schema.Types.ObjectId"
                if f.get('ref'): type_def += f", ref: \"{f['ref']}\""
            elif f['type'] == 'Date': type_def = "type: Date"
            else: type_def = f"type: {f['type']}"

            if is_array:
                if f['type'] == 'ObjectId':
                    base_config = f"{{ {type_def} }}"
                    line = f"    {f['name']}: [{base_config}]"
                else:
                    if f.get('required'):
                        line = f"    {f['name']}: [{{ {type_def}, required: true }}]"
                    else:
                        line = f"    {f['name']}: [{f['type']}]"
            else:
                props = [type_def]
                if f.get('required'): props.append('required: true')
                if f.get('default') is not None:
                     val = str(f['default']).lower() if isinstance(f['default'], bool) else f['default']
                     props.append(f'default: {val}')
                line = f"    {f['name']}: {{ {', '.join(props)} }}"
            schema_fields.append(line)

        content = f"""import {{ Schema, model }} from "mongoose";

const {self.camel}Schema = new Schema(
  {{
{',\n'.join(schema_fields)}
  }},
  {{ timestamps: true, collection: "{self.plural}" }}
);

export default model("{self.pascal}", {self.camel}Schema);
"""
        self._write_file(file_path, content)

    # 2. Models Types
    def update_models_types(self):
        file_path = PATHS['types'] / "models.ts"
        if not file_path.exists():
            self._write_file(file_path, 'import { Types } from "mongoose";\n\n// --- Model Type Definitions ---\n')
        ts_lines = []
        ts_lines.append(f"export interface {self.pascal}Type {{")
        ts_lines.append("  _id: Types.ObjectId;")
        for f in self.fields:
            ts_type = 'string'
            if f['type'] == 'Number': ts_type = 'number'
            if f['type'] == 'Boolean': ts_type = 'boolean'
            if f['type'] == 'Date': ts_type = 'Date'
            if f['type'] == 'ObjectId': ts_type = 'Types.ObjectId'
            if f.get('is_array'): ts_type = f"{ts_type}[]"
            suffix = "?" if not f.get('required') else ""
            ts_lines.append(f"  {f['name']}{suffix}: {ts_type};")
        ts_lines.append("  createdAt?: Date;")
        ts_lines.append("  updatedAt?: Date;")
        ts_lines.append("}\n")
        with open(file_path, "a", encoding="utf-8") as f: f.write("\n" + "\n".join(ts_lines))
        print(f"{Fore.BLUE}   ✏️  Updated types/models.ts")

    # 3. GraphQL Types
    def update_graphql_types(self):
        file_path = PATHS['types'] / "graphql.ts"
        if not file_path.exists():
            self._write_file(file_path, 'import { Request } from "express";\nimport { RedisPubSub } from "graphql-redis-subscriptions";\nimport { RedisClientType } from "redis";\nimport DataLoader from "dataloader";\nimport { Types } from "mongoose";\nimport { /* IMPORTS_HERE */ } from "./models.js";\n\nexport interface DataLoaders {\n  /* LOADERS_HERE */\n}\n\nexport interface MyContext {\n  req: Request;\n  pubsub: RedisPubSub;\n  redisClient: RedisClientType;\n  loaders: DataLoaders;\n}\n')
        with open(file_path, "r", encoding="utf-8") as f: content = f.read()
        if f"{self.pascal}Type" not in content:
            if "/* IMPORTS_HERE */" in content: content = content.replace("/* IMPORTS_HERE */", f"{self.pascal}Type,\n  /* IMPORTS_HERE */")
            elif '} from "./models.js";' in content: content = content.replace('} from "./models.js";', f"  {self.pascal}Type,\n}} from \"./models.js\";")
        loader_line = f"{self.camel}Loader: DataLoader<string, {self.pascal}Type | null>;"
        if loader_line not in content:
            if "/* LOADERS_HERE */" in content: content = content.replace("/* LOADERS_HERE */", f"{loader_line}\n  /* LOADERS_HERE */")
            else: content = re.sub(r'(interface DataLoaders \{[^}]*)', f'\\1\n  {loader_line}', content)
        with open(file_path, "w", encoding="utf-8") as f: f.write(content)
        print(f"{Fore.BLUE}   ✏️  Updated types/graphql.ts")

    # 4. TypeDefs
    def update_typedefs(self):
        file_path = PATHS['schemas'] / "typeDefs.ts"
        gql_fields, input_fields, filter_fields = [], [], []
        for f in self.fields:
            gql_type = 'String'
            if f['type'] == 'Number': gql_type = 'Float'
            if f['type'] == 'Boolean': gql_type = 'Boolean'
            if f['type'] == 'ObjectId': gql_type = 'ID'
            if f.get('is_array'): gql_type = f"[{gql_type}]"
            bang = '!' if f.get('required') else ''
            gql_fields.append(f"    {f['name']}: {gql_type}{bang}")
            input_fields.append(f"    {f['name']}: {gql_type}")
            if not f.get('is_array'): filter_fields.append(f"    {f['name']}: {gql_type}")
            else: filter_fields.append(f"    {f['name']}: {gql_type.replace('[','').replace(']','')}")

        type_def = f"  type {self.pascal} {{\n    _id: ID!\n{chr(10).join(gql_fields)}\n    createdAt: String\n    updatedAt: String\n  }}"
        input_def = f"\n  input {self.pascal}Input {{\n{chr(10).join(input_fields)}\n  }}" if self.has_opt('CRUD') else ""
        connection_def = f"\n  type {self.pascal}Connection {{\n    {self.plural}: [{self.pascal}!]!\n    cursor: ID\n    hasMore: Boolean!\n  }}" if self.has_opt('Pagination') else ""
        filter_def = f"\n  input {self.pascal}Filter {{\n    search: String\n{chr(10).join(filter_fields)}\n  }}" if (self.has_opt('Filter') or self.has_opt('Search')) else ""
        sort_def = f"\n  input {self.pascal}Sort {{\n    field: String\n    order: String\n  }}" if self.has_opt('Sort') else ""

        query_args = []
        if self.has_opt('Pagination'): query_args.extend(["pageSize: Int", "after: ID"])
        if self.has_opt('Filter') or self.has_opt('Search'): query_args.append(f"filter: {self.pascal}Filter")
        if self.has_opt('Sort'): query_args.append(f"sort: {self.pascal}Sort")
        query_args_str = f"({', '.join(query_args)})" if query_args else ""
        query_return = f"{self.pascal}Connection!" if self.has_opt('Pagination') else f"[{self.pascal}!]!"

        query_block = f"\n  extend type Query {{\n    {self.plural}{query_args_str}: {query_return}\n    getOne{self.pascal}(_id: ID!): {self.pascal}\n  }}"
        mutation_block = f"\n  extend type Mutation {{\n    create{self.pascal}(input: {self.pascal}Input!): {self.pascal}!\n    update{self.pascal}(_id: ID!, input: {self.pascal}Input!): {self.pascal}\n    delete{self.pascal}(_id: ID!): {self.pascal}\n  }}" if self.has_opt('CRUD') else ""
        sub_block = f"\n  extend type Subscription {{\n    {self.camel}Added: {self.pascal}!\n  }}" if self.has_opt('Subscription') else ""

        full_block = f"\n{type_def}{input_def}{connection_def}{filter_def}{sort_def}{query_block}{mutation_block}{sub_block}\n"

        if not file_path.exists():
            content = 'import { gql } from "graphql-tag";\n\nexport default gql`\n' + full_block + '\n`;'
            self._write_file(file_path, content)
        else:
            with open(file_path, 'r', encoding="utf-8") as f: content = f.read()
            last_tick = content.rfind('`')
            if last_tick != -1:
                content = content[:last_tick] + full_block + content[last_tick:]
                with open(file_path, 'w', encoding='utf-8') as f: f.write(content)
                print(f"{Fore.BLUE}   ✏️  Updated schemas/typeDefs.ts")

    # 5. Resolvers
    def create_resolvers(self):
        file_path = PATHS['resolvers'] / f"{self.camel}.ts"
        imports = [f'import {self.pascal} from "../models/{self.camel}.model.js";']
        if self.has_opt('Subscription'): imports.append('import { pubsub } from "../utils/redisDb.js";')
        constants = f'const {self.pascal.upper()}_ADDED = "{self.pascal.upper()}_ADDED";' if self.has_opt('Subscription') else ""

        q_args_destructure = []
        if self.has_opt('Pagination'): q_args_destructure.extend(['pageSize = 20', 'after'])
        if self.has_opt('Filter') or self.has_opt('Search'): q_args_destructure.append('filter')
        if self.has_opt('Sort'): q_args_destructure.append('sort')
        q_args_str = f"_, {{ {', '.join(q_args_destructure)} }}"

        q_body = ["      let query: any = {};"]
        if self.has_opt('Filter') or self.has_opt('Search'):
            q_body.append("      if (filter) {")
            string_fields = [f['name'] for f in self.fields if f['type'] == 'String' and not f.get('is_array')]
            if self.has_opt('Search') and string_fields:
                q_body.append("        if (filter.search) {")
                q_body.append("          query.$or = [")
                for sf in string_fields: q_body.append(f"            {{ {sf}: {{ $regex: filter.search, $options: 'i' }} }},")
                q_body.append("          ];")
                q_body.append("        }")
            for f in self.fields: q_body.append(f"        if (filter.{f['name']}) query.{f['name']} = filter.{f['name']};")
            q_body.append("      }")

        if self.has_opt('Pagination'):
             q_body.extend(["      if (after) {", "        query._id = { $lt: after };", "      }", "      const limit = pageSize + 1;"])
        
        sort_str = "sortOptions" if self.has_opt('Sort') else "{ _id: -1 }"
        if self.has_opt('Sort'): q_body.append("      const sortOptions: any = sort ? { [sort.field]: sort.order === 'ASC' ? 1 : -1 } : { _id: -1 };")

        find_line = f"      const items = await {self.pascal}.find(query).sort({sort_str})"
        find_line += ".limit(limit);" if self.has_opt('Pagination') else ";"
        q_body.append(find_line)

        if self.has_opt('Pagination'):
            q_body.extend(["      const hasMore = items.length === limit;", "      const results = hasMore ? items.slice(0, -1) : items;", "      const cursor = results.length > 0 ? results[results.length - 1]._id.toString() : null;", f"      return {{ {self.plural}: results, cursor, hasMore }};"])
        else: q_body.append("      return items;")

        resolvers_obj = { "Query": f"    {self.plural}: async ({q_args_str}) => {{\n{chr(10).join(q_body)}\n    }},\n    getOne{self.pascal}: async (_, {{ _id }}) => await {self.pascal}.findById(_id)," }

        if self.has_opt('CRUD'):
            pubsub_line = f"\n      pubsub.publish({self.pascal.upper()}_ADDED, {{ {self.camel}Added: newItem }});" if self.has_opt('Subscription') else ""
            resolvers_obj["Mutation"] = f"    create{self.pascal}: async (_, {{ input }}) => {{\n      const newItem = await {self.pascal}.create(input);{pubsub_line}\n      return newItem;\n    }},\n    update{self.pascal}: async (_, {{ _id, input }}) => {{\n      return await {self.pascal}.findByIdAndUpdate(_id, input, {{ new: true }});\n    }},\n    delete{self.pascal}: async (_, {{ _id }}) => {{\n      return await {self.pascal}.findByIdAndDelete(_id);\n    }},"

        if self.has_opt('Subscription'):
            resolvers_obj["Subscription"] = f"    {self.camel}Added: {{\n      subscribe: () => pubsub.asyncIterator([{self.pascal.upper()}_ADDED]),\n    }},"

        resolver_content = f"{chr(10).join(imports)}\n\n{constants}\n\nexport const {self.camel}Resolvers = {{\n  Query: {{\n{resolvers_obj['Query']}\n  }},\n"
        if "Mutation" in resolvers_obj: resolver_content += f"  Mutation: {{\n{resolvers_obj['Mutation']}\n  }},\n"
        if "Subscription" in resolvers_obj: resolver_content += f"  Subscription: {{\n{resolvers_obj['Subscription']}\n  }},\n"
        resolver_content += "};\n"
        self._write_file(file_path, resolver_content)

    def update_resolver_index(self):
        file_path = PATHS['resolvers'] / "index.ts"
        resolver_var = f"{self.camel}Resolvers"
        if not file_path.exists(): return
        with open(file_path, "r", encoding="utf-8") as f: content = f.read()
        if f'./{self.camel}.js' not in content: content = f'import {{ {resolver_var} }} from "./{self.camel}.js";\n' + content
        def inject_spread(key):
            nonlocal content
            pattern = rf"({key}:\s*\{{)"
            spread = f"    ...{resolver_var}.{key},"
            if spread not in content: content = re.sub(pattern, rf"\1\n{spread}", content)
        inject_spread('Query')
        if self.has_opt('CRUD'): inject_spread('Mutation')
        if self.has_opt('Subscription'): inject_spread('Subscription')
        with open(file_path, "w", encoding="utf-8") as f: f.write(content)
        print(f"{Fore.BLUE}   ✏️  Updated resolvers/index.ts")

    def update_loaders(self):
        file_path = PATHS['utils'] / "loaders.ts"
        field_names = " ".join([f['name'] for f in self.fields])
        select_fields = f"_id {field_names} createdAt updatedAt"
        upper, model_import = self.pascal.upper(), f'import {self.pascal} from "../models/{self.camel}.model.js";'
        prefix_const, fields_const = f'const {upper}_PREFIX = "{self.camel}:";', f'  const {self.camel}Fields = "{select_fields}";'
        loader_instance = f"    {self.camel}Loader: new DataLoader<string, {self.pascal}Type | null>(\n      createBatchFn<{self.pascal}Type>(\n        {self.pascal},\n        {self.camel}Fields,\n        {upper}_PREFIX,\n        redisClient\n      )\n    ),"

        if not file_path.exists():
            self._write_file(file_path, self._get_loaders_boilerplate(select_fields, prefix_const, loader_instance))
            return
        with open(file_path, "r", encoding="utf-8") as f: content = f.read()
        if f'../models/{self.camel}.model.js' not in content: content = content.replace('// --- End Model Imports ---', f'{model_import}\n// --- End Model Imports ---')
        if f'{self.pascal}Type' not in content: content = re.sub(r'(import\s*\{)([^}]*)(\}\s*from\s*"\.\./types/models\.js";)', rf'\1\2  {self.pascal}Type,\3', content)
        if f'{upper}_PREFIX' not in content: content = content.replace('// --- End Caching Constants ---', f'{prefix_const}\n// --- End Caching Constants ---')
        if f'{self.camel}Fields' not in content: content = content.replace('export const createLoaders = (redisClient: RedisClient) => {', f'export const createLoaders = (redisClient: RedisClient) => {{\n{fields_const}')
        if f'{self.camel}Loader:' not in content:
            marker = '// Add other loaders here'
            if marker in content: content = content.replace(marker, f'{loader_instance}\n    {marker}')
            else: content = content.replace('return {', f'return {{\n{loader_instance}')
        with open(file_path, "w", encoding="utf-8") as f: f.write(content)
        print(f"{Fore.BLUE}   ✏️  Updated utils/loaders.ts")

    def _get_loaders_boilerplate(self, select_fields, prefix_const, loader_instance):
        return f"""import DataLoader from "dataloader";
import {{ Types, Model }} from "mongoose";
import {{ RedisClientType }} from "redis";
// --- Model Imports ---
import {self.pascal} from "../models/{self.camel}.model.js";
// --- End Model Imports ---
import {{ MyContext }} from "../types/graphql.js";
import {{ {self.pascal}Type }} from "../types/models.js";
type RedisClient = RedisClientType;
// --- Caching Constants ---
const CACHE_TTL_SECONDS = 3600; 
{prefix_const}
// --- End Caching Constants ---
const createBatchFn = <T extends {{ _id: Types.ObjectId }}>(model: Model<any>, selectFields: string, cachePrefix: string, redisClient: RedisClient) => async (keys: readonly string[]): Promise<(T | null)[]> => {{
    const uniqueKeys = [...new Set(keys)];
    const cacheKeys = uniqueKeys.map((k) => cachePrefix + k);
    let results: (T | null)[] = [];
    try {{
      const cachedResults = await redisClient.mGet(cacheKeys);
      const parsedCache: (T | null)[] = cachedResults.map((res) => res ? JSON.parse(res) : null);
      const cacheMap = new Map<string, T | null>();
      const keysToFetch: string[] = [];
      uniqueKeys.forEach((key, index) => {{
        if (parsedCache[index]) cacheMap.set(key, parsedCache[index]);
        else keysToFetch.push(key);
      }});
      if (keysToFetch.length > 0) {{
        const dbResults = await model.find({{ _id: {{ $in: keysToFetch.map((k) => new Types.ObjectId(k)) }} }}).select(selectFields).lean<T[]>();
        const cachePipeline = redisClient.multi();
        for (const doc of dbResults) {{
          const docId = String(doc._id);
          cacheMap.set(docId, doc);
          cachePipeline.set(cachePrefix + docId, JSON.stringify(doc), {{ EX: CACHE_TTL_SECONDS }});
        }}
        await cachePipeline.exec();
      }}
      results = uniqueKeys.map((key) => cacheMap.get(key) || null);
    }} catch (error) {{
      console.error(`Error in batch loader for ${{model.modelName}}:`, error);
      return keys.map(() => null);
    }}
    const finalResultMap = new Map(uniqueKeys.map((key, i) => [key, results[i]]));
    return keys.map((key) => finalResultMap.get(key) || null);
}};
export const createLoaders = (redisClient: RedisClient) => {{
  const {self.camel}Fields = "{select_fields}";
  return {{
{loader_instance}
    // Add other loaders here following the same pattern
  }};
}};
"""

    def _write_file(self, path, content):
        if path.exists():
            print(f"{Fore.YELLOW}   ℹ️  Overwriting {path.name}...")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"{Fore.GREEN}   📄 Created {path.name}")

# ==========================================
# 3. EXECUTION LOGIC
# ==========================================

def transform_config_to_fields(config):
    fields_list = []
    for name, props in config.items():
        fields_list.append({
            "name": name,
            "type": props.get("type"),
            "required": props.get("required", False),
            "ref": props.get("ref"),
            "is_array": props.get("is_array", False),
            "default": props.get("default")
        })
    return fields_list

if __name__ == '__main__':
    try:
        if not ENTITY_NAME:
            print(f"{Fore.RED}❌ Error: Please set ENTITY_NAME in the script config.")
        elif not SCHEMA_CONFIG:
             print(f"{Fore.RED}❌ Error: Please set SCHEMA_CONFIG in the script config.")
        else:
            fields = transform_config_to_fields(SCHEMA_CONFIG)
            scaffolder = Scaffolder(ENTITY_NAME, fields, FEATURES)
            scaffolder.run()
    except KeyboardInterrupt:
        print("\nCancelled.")