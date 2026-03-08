import os
import re
import sys
import questionary
from pathlib import Path
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# ==========================================
# 1. CONFIGURATION & UTILS
# ==========================================

# Determine Base Directory
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

# ==========================================
# 2. FILE GENERATORS
# ==========================================

class Scaffolder:
    def __init__(self, entity_name, fields, options):
        self.entity_raw = entity_name
        self.pascal = Utils.pascal_case(entity_name)
        self.camel = Utils.camel_case(entity_name)
        self.plural = Utils.pluralize(self.camel)
        self.plural_pascal = Utils.pluralize(self.pascal)
        self.fields = fields
        self.options = options # List of selected features

    def has_opt(self, opt):
        return opt in self.options

    def run(self):
        print(f"\n{Fore.CYAN}--- Starting Scaffold for {self.pascal} ---")
        print(f"{Fore.CYAN}--- Features: {', '.join(self.options)} ---")
        Utils.ensure_dirs()
        
        # 1. Mongoose Model (Always needed)
        self.create_mongoose_model()
        
        # 2. TS Types
        self.update_models_types()
        
        # 3. GraphQL Types
        self.update_graphql_types()
        
        # 4. TypeDefs (Schema) - Heavily influenced by options
        self.update_typedefs()
        
        # 5. Resolvers - Heavily influenced by options
        self.create_resolvers()
        self.update_resolver_index()
        
        # 6. Loaders (Caching) - Always good to have if we have types
        self.update_loaders()
        
        print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ All tasks completed successfully for {self.pascal}!")

    # ---------------------------------------------------------
    # 1. Mongoose Model
    # ---------------------------------------------------------
    def create_mongoose_model(self):
        file_path = PATHS['models'] / f"{self.camel}.model.ts"
        
        schema_fields = []
        for f in self.fields:
            line = ""
            is_array = f.get('is_array', False)
            
            # Construct the inner type definition
            type_def = ""
            if f['type'] == 'ObjectId':
                type_def = f"type: Schema.Types.ObjectId"
                if f.get('ref'):
                     type_def += f", ref: \"{f['ref']}\""
            elif f['type'] == 'Date':
                type_def = "type: Date"
            else:
                type_def = f"type: {f['type']}" # String, Number, Boolean

            # Handle Array wrapping
            if is_array:
                # If it's an object ID array, we wrap the whole dict in curlies
                if f['type'] == 'ObjectId':
                    # output: [{ type: Schema.Types.ObjectId, ref: 'User' }]
                    base_config = f"{{ {type_def} }}"
                    line = f"    {f['name']}: [{base_config}]"
                else:
                    # output: [String] or [{ type: String, required: true }]
                    # For simple primitives, Mongoose allows [String], but if we have validation, we need [{type:String}]
                    # To keep it simple and support required checks:
                    if f['required']:
                        line = f"    {f['name']}: [{{ {type_def}, required: true }}]"
                    else:
                        line = f"    {f['name']}: [{f['type']}]"
            else:
                # Standard scalar field
                props = [type_def]
                if f['required']: props.append('required: true')
                if f['type'] == 'Boolean': props.append('default: false')
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

    # ---------------------------------------------------------
    # 2. Models Types
    # ---------------------------------------------------------
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
            
            # Handle Array
            if f.get('is_array'):
                ts_type = f"{ts_type}[]"
            
            suffix = "?" if not f['required'] else ""
            ts_lines.append(f"  {f['name']}{suffix}: {ts_type};")

        ts_lines.append("  createdAt?: Date;")
        ts_lines.append("  updatedAt?: Date;")
        ts_lines.append("}\n")

        with open(file_path, "a", encoding="utf-8") as f:
            f.write("\n" + "\n".join(ts_lines))
        print(f"{Fore.BLUE}   ✏️  Updated types/models.ts")

    # ---------------------------------------------------------
    # 3. GraphQL Types
    # ---------------------------------------------------------
    def update_graphql_types(self):
        file_path = PATHS['types'] / "graphql.ts"
        if not file_path.exists():
            content = """import { Request } from "express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { RedisClientType } from "redis";
import DataLoader from "dataloader";
import { Types } from "mongoose";
import { /* IMPORTS_HERE */ } from "./models.js";

export interface DataLoaders {
  /* LOADERS_HERE */
}

export interface MyContext {
  req: Request;
  pubsub: RedisPubSub;
  redisClient: RedisClientType;
  loaders: DataLoaders;
}
"""
            self._write_file(file_path, content)

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if f"{self.pascal}Type" not in content:
            if "/* IMPORTS_HERE */" in content:
                content = content.replace("/* IMPORTS_HERE */", f"{self.pascal}Type,\n  /* IMPORTS_HERE */")
            elif '} from "./models.js";' in content:
                content = content.replace('} from "./models.js";', f"  {self.pascal}Type,\n}} from \"./models.js\";")

        loader_line = f"{self.camel}Loader: DataLoader<string, {self.pascal}Type | null>;"
        if loader_line not in content:
            if "/* LOADERS_HERE */" in content:
                content = content.replace("/* LOADERS_HERE */", f"{loader_line}\n  /* LOADERS_HERE */")
            else:
                content = re.sub(r'(interface DataLoaders \{[^}]*)', f'\\1\n  {loader_line}', content)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"{Fore.BLUE}   ✏️  Updated types/graphql.ts")

    # ---------------------------------------------------------
    # 4. TypeDefs (Conditional)
    # ---------------------------------------------------------
    def update_typedefs(self):
        file_path = PATHS['schemas'] / "typeDefs.ts"
        
        gql_fields = []
        input_fields = []
        filter_fields = []
        
        for f in self.fields:
            gql_type = 'String'
            if f['type'] == 'Number': gql_type = 'Float'
            if f['type'] == 'Boolean': gql_type = 'Boolean'
            if f['type'] == 'ObjectId': gql_type = 'ID'
            
            # Handle Array
            if f.get('is_array'):
                gql_type = f"[{gql_type}]"
            
            # Logic for ! (Non-nullable)
            # In GQL, [String] means list is optional, contents nullable.
            # [String!]! means list required, contents required.
            # For simplicity, if required is true, we make the field required, but keep contents default
            bang = '!' if f['required'] else ''
            
            gql_fields.append(f"    {f['name']}: {gql_type}{bang}")
            input_fields.append(f"    {f['name']}: {gql_type}")
            
            # Filter usually allows optional fields
            # Arrays are harder to filter in simple GQL, usually standard implementation 
            # checks for existence or "contains". We'll keep it simple:
            if not f.get('is_array'):
                filter_fields.append(f"    {f['name']}: {gql_type}")
            else:
                # Basic array filter support (contains one)
                base_type = gql_type.replace('[','').replace(']','')
                filter_fields.append(f"    {f['name']}: {base_type}")

        # Build blocks
        type_def = f"""  type {self.pascal} {{
    _id: ID!
{chr(10).join(gql_fields)}
    createdAt: String
    updatedAt: String
  }}"""

        input_def = ""
        if self.has_opt('CRUD'):
            input_def = f"""
  input {self.pascal}Input {{
{chr(10).join(input_fields)}
  }}"""

        connection_def = ""
        if self.has_opt('Pagination'):
            connection_def = f"""
  type {self.pascal}Connection {{
    {self.plural}: [{self.pascal}!]!
    cursor: ID
    hasMore: Boolean!
  }}"""

        filter_def = ""
        if self.has_opt('Filter') or self.has_opt('Search'):
            filter_def = f"""
  input {self.pascal}Filter {{
    search: String
{chr(10).join(filter_fields)}
  }}"""
  
        sort_def = ""
        if self.has_opt('Sort'):
             # Generic sort object
             sort_def = f"""
  input {self.pascal}Sort {{
    field: String
    order: String # ASC or DESC
  }}"""

        # Construct Query Args
        query_args = []
        if self.has_opt('Pagination'):
            query_args.append("pageSize: Int")
            query_args.append("after: ID")
        if self.has_opt('Filter') or self.has_opt('Search'):
            query_args.append(f"filter: {self.pascal}Filter")
        if self.has_opt('Sort'):
            query_args.append(f"sort: {self.pascal}Sort")
            
        query_args_str = f"({', '.join(query_args)})" if query_args else ""
        
        # Determine Return Type
        query_return = f"{self.pascal}Connection!" if self.has_opt('Pagination') else f"[{self.pascal}!]!"

        query_block = f"""
  extend type Query {{
    {self.plural}{query_args_str}: {query_return}
    getOne{self.pascal}(_id: ID!): {self.pascal}
  }}"""

        mutation_block = ""
        if self.has_opt('CRUD'):
            mutation_block = f"""
  extend type Mutation {{
    create{self.pascal}(input: {self.pascal}Input!): {self.pascal}!
    update{self.pascal}(_id: ID!, input: {self.pascal}Input!): {self.pascal}
    delete{self.pascal}(_id: ID!): {self.pascal}
  }}"""

        subscription_block = ""
        if self.has_opt('Subscription'):
            subscription_block = f"""
  extend type Subscription {{
    {self.camel}Added: {self.pascal}!
  }}"""

        # Assemble full block
        full_block = f"\n{type_def}{input_def}{connection_def}{filter_def}{sort_def}{query_block}{mutation_block}{subscription_block}\n"

        if not file_path.exists():
            content = 'import { gql } from "graphql-tag";\n\nexport default gql`\n' + full_block + '\n`;'
            self._write_file(file_path, content)
        else:
            with open(file_path, 'r', encoding="utf-8") as f:
                content = f.read()
            last_tick = content.rfind('`')
            if last_tick != -1:
                content = content[:last_tick] + full_block + content[last_tick:]
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"{Fore.BLUE}   ✏️  Updated schemas/typeDefs.ts")

    # ---------------------------------------------------------
    # 5. Resolvers (Conditional Logic)
    # ---------------------------------------------------------
    def create_resolvers(self):
        file_path = PATHS['resolvers'] / f"{self.camel}.ts"
        
        # Imports
        imports = [f'import {self.pascal} from "../models/{self.camel}.model.js";']
        if self.has_opt('Subscription'):
            imports.append('import { pubsub } from "../utils/redisDb.js";')
            
        # Constants
        constants = ""
        if self.has_opt('Subscription'):
            constants = f'const {self.pascal.upper()}_ADDED = "{self.pascal.upper()}_ADDED";'

        # Query Resolver Logic
        query_args_destructure = []
        if self.has_opt('Pagination'): query_args_destructure.extend(['pageSize = 20', 'after'])
        if self.has_opt('Filter') or self.has_opt('Search'): query_args_destructure.append('filter')
        if self.has_opt('Sort'): query_args_destructure.append('sort')
        
        q_args_str = f"_, {{ {', '.join(query_args_destructure)} }}"

        # Build Query Body
        q_body = []
        q_body.append("      let query: any = {};")
        
        # Filter Logic
        if self.has_opt('Filter') or self.has_opt('Search'):
            q_body.append("      if (filter) {")
            # Global Search across string fields
            # Only search standard string fields, not string arrays
            string_fields = [f['name'] for f in self.fields if f['type'] == 'String' and not f.get('is_array')]
            
            if self.has_opt('Search') and string_fields:
                q_body.append("        if (filter.search) {")
                q_body.append("          query.$or = [")
                for sf in string_fields:
                     q_body.append(f"            {{ {sf}: {{ $regex: filter.search, $options: 'i' }} }},")
                q_body.append("          ];")
                q_body.append("        }")
            # Specific Field Filter
            for f in self.fields:
                # If array, filtering usually means "does array contain this value?"
                # Mongoose handles { arrayField: value } as "array contains value"
                q_body.append(f"        if (filter.{f['name']}) query.{f['name']} = filter.{f['name']};")
            q_body.append("      }")
            
        # Pagination Logic (Cursor)
        if self.has_opt('Pagination'):
             q_body.append("      if (after) {")
             q_body.append("        query._id = { $lt: after };")
             q_body.append("      }")
             q_body.append("      const limit = pageSize + 1;")
        
        # Sort Logic
        sort_str = "{ _id: -1 }"
        if self.has_opt('Sort'):
             # FIX: Added : any type annotation to sortOptions to prevent TS2345 Mongoose SortOrder mismatch
             q_body.append("      const sortOptions: any = sort ? { [sort.field]: sort.order === 'ASC' ? 1 : -1 } : { _id: -1 };")
             sort_str = "sortOptions"

        # Execute Query
        find_line = f"      const items = await {self.pascal}.find(query).sort({sort_str})"
        if self.has_opt('Pagination'):
            find_line += ".limit(limit);"
        else:
            find_line += ";"
        q_body.append(find_line)
        
        # Return Logic
        if self.has_opt('Pagination'):
            q_body.append("      const hasMore = items.length === limit;")
            q_body.append("      const results = hasMore ? items.slice(0, -1) : items;")
            q_body.append("      const cursor = results.length > 0 ? results[results.length - 1]._id.toString() : null;")
            q_body.append(f"      return {{ {self.plural}: results, cursor, hasMore }};")
        else:
             q_body.append("      return items;")

        # Assemble Objects
        resolvers_obj = {
            "Query": f"""    {self.plural}: async ({q_args_str}) => {{
{chr(10).join(q_body)}
    }},
    getOne{self.pascal}: async (_, {{ _id }}) => await {self.pascal}.findById(_id),"""
        }

        if self.has_opt('CRUD'):
            pubsub_line = ""
            if self.has_opt('Subscription'):
                pubsub_line = f"\n      pubsub.publish({self.pascal.upper()}_ADDED, {{ {self.camel}Added: newItem }});"
            
            resolvers_obj["Mutation"] = f"""    create{self.pascal}: async (_, {{ input }}) => {{
      const newItem = await {self.pascal}.create(input);{pubsub_line}
      return newItem;
    }},
    update{self.pascal}: async (_, {{ _id, input }}) => {{
      return await {self.pascal}.findByIdAndUpdate(_id, input, {{ new: true }});
    }},
    delete{self.pascal}: async (_, {{ _id }}) => {{
      return await {self.pascal}.findByIdAndDelete(_id);
    }},"""

        if self.has_opt('Subscription'):
            resolvers_obj["Subscription"] = f"""    {self.camel}Added: {{
      subscribe: () => pubsub.asyncIterator([{self.pascal.upper()}_ADDED]),
    }},"""

        # Final String Construction
        resolver_content = f"""{chr(10).join(imports)}

{constants}

export const {self.camel}Resolvers = {{
  Query: {{
{resolvers_obj['Query']}
  }},
"""
        if "Mutation" in resolvers_obj:
            resolver_content += f"""  Mutation: {{
{resolvers_obj['Mutation']}
  }},
"""
        if "Subscription" in resolvers_obj:
            resolver_content += f"""  Subscription: {{
{resolvers_obj['Subscription']}
  }},
"""
        resolver_content += "};\n"
        
        self._write_file(file_path, resolver_content)

    def update_resolver_index(self):
        file_path = PATHS['resolvers'] / "index.ts"
        resolver_var = f"{self.camel}Resolvers"
        
        if not file_path.exists():
            return

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if f'./{self.camel}.js' not in content:
            content = f'import {{ {resolver_var} }} from "./{self.camel}.js";\n' + content

        def inject_spread(key):
            nonlocal content
            pattern = rf"({key}:\s*\{{)"
            spread = f"    ...{resolver_var}.{key},"
            # Only inject if key exists in content AND key exists in our new resolver
            # We assume index.ts has Query/Mutation structure
            if spread not in content:
                 # Check if this resolver actually has this key?
                 # Since we are modifying index.ts blindly, we assume the user maintains structure
                 # A safer way is regex replacement if the block exists
                 content = re.sub(pattern, rf"\1\n{spread}", content)

        inject_spread('Query')
        if self.has_opt('CRUD'): inject_spread('Mutation')
        if self.has_opt('Subscription'): inject_spread('Subscription')

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"{Fore.BLUE}   ✏️  Updated resolvers/index.ts")

    # ---------------------------------------------------------
    # 6. Loaders (No change needed, always useful)
    # ---------------------------------------------------------
    def update_loaders(self):
        file_path = PATHS['utils'] / "loaders.ts"
        field_names = " ".join([f['name'] for f in self.fields])
        select_fields = f"_id {field_names} createdAt updatedAt"
        upper = self.pascal.upper()
        
        model_import = f'import {self.pascal} from "../models/{self.camel}.model.js";'
        prefix_const = f'const {upper}_PREFIX = "{self.camel}:";'
        fields_const = f'  const {self.camel}Fields = "{select_fields}";'
        
        loader_instance = f"""    {self.camel}Loader: new DataLoader<string, {self.pascal}Type | null>(
      createBatchFn<{self.pascal}Type>(
        {self.pascal},
        {self.camel}Fields,
        {upper}_PREFIX,
        redisClient
      )
    ),"""

        if not file_path.exists():
            self._write_file(file_path, self._get_loaders_boilerplate(select_fields, prefix_const, loader_instance))
            return

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if f'../models/{self.camel}.model.js' not in content:
            content = content.replace('// --- End Model Imports ---', f'{model_import}\n// --- End Model Imports ---')

        if f'{self.pascal}Type' not in content:
             content = re.sub(r'(import\s*\{)([^}]*)(\}\s*from\s*"\.\./types/models\.js";)', rf'\1\2  {self.pascal}Type,\3', content)

        if f'{upper}_PREFIX' not in content:
            content = content.replace('// --- End Caching Constants ---', f'{prefix_const}\n// --- End Caching Constants ---')

        if f'{self.camel}Fields' not in content:
             content = content.replace('export const createLoaders = (redisClient: RedisClient) => {', f'export const createLoaders = (redisClient: RedisClient) => {{\n{fields_const}')

        if f'{self.camel}Loader:' not in content:
            marker = '// Add other loaders here'
            if marker in content:
                content = content.replace(marker, f'{loader_instance}\n    {marker}')
            else:
                content = content.replace('return {', f'return {{\n{loader_instance}')

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
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
// --- End Type Definitions ---

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
            should_overwrite = questionary.confirm(f"File {path.name} exists. Overwrite?").ask()
            if not should_overwrite:
                print(f"{Fore.YELLOW}   ⏭️  Skipped {path.name}")
                return
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"{Fore.GREEN}   📄 Created {path.name}")

# ==========================================
# 3. WIZARD INTERFACE
# ==========================================

def run_wizard():
    print(f"\n{Fore.GREEN}{Style.BRIGHT}🚀 GQL + Mongoose + TS Scaffolder 🚀\n")

    entity_name = questionary.text("Entity Name (e.g. Ticket):", validate=lambda t: len(t) > 0).ask()
    if not entity_name: return

    fields = []
    print(f"{Fore.CYAN}--- Define Fields for {entity_name} ---")
    
    while True:
        f_name = questionary.text("Field Name (leave empty to finish):").ask()
        if not f_name: break

        f_type = questionary.select(
            "Field Type:",
            choices=['String', 'Number', 'Boolean', 'ObjectId', 'Date']
        ).ask()
        
        ref = None
        if f_type == 'ObjectId':
            ref = questionary.text("Ref Model (e.g. User):").ask()
            
        # --- NEW: ASK IF ARRAY ---
        is_array = questionary.confirm("Is this an Array (List)?", default=False).ask()
        # -------------------------

        required = questionary.confirm("Required?", default=False).ask()
        
        fields.append({ 
            "name": f_name, 
            "type": f_type, 
            "required": required, 
            "ref": ref,
            "is_array": is_array 
        })

    # Select Features
    print(f"\n{Fore.CYAN}--- Select Features ---")
    options = questionary.checkbox(
        "Which features do you need?",
        choices=[
            questionary.Choice("CRUD", checked=True),
            questionary.Choice("Subscription", checked=True),
            questionary.Choice("Pagination", checked=True),
            questionary.Choice("Search", checked=True),
            questionary.Choice("Filter", checked=True),
            questionary.Choice("Sort", checked=True),
        ],
    ).ask()

    scaffolder = Scaffolder(entity_name, fields, options)
    scaffolder.run()

if __name__ == '__main__':
    try:
        run_wizard()
    except KeyboardInterrupt:
        print("\nCancelled.")