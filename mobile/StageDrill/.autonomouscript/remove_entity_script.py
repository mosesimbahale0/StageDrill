import os
import re
import sys
import questionary
from pathlib import Path
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# ==========================================
# 1. CONFIGURATION & UTILS (Mirrored from Scaffolder)
# ==========================================

# Determine Base Directory
if len(sys.argv) > 1:
    BASE_DIR = Path(sys.argv[1]).resolve()
else:
    BASE_DIR = Path.cwd()

SRC_DIR = BASE_DIR / 'src'

PATHS = {
    'models': SRC_DIR / 'models',
    'resolvers': SRC_DIR / 'resolvers',
    'schemas': SRC_DIR / 'schemas',
    'types': SRC_DIR / 'types',
    'utils': SRC_DIR / 'utils',
}

class Utils:
    # EXACT same utils as the creator script to ensure names match
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

# ==========================================
# 2. CLEANER LOGIC
# ==========================================

class Cleaner:
    def __init__(self, entity_name):
        self.entity_raw = entity_name
        self.pascal = Utils.pascal_case(entity_name)
        self.camel = Utils.camel_case(entity_name)
        self.plural = Utils.pluralize(self.camel)
        self.plural_pascal = Utils.pluralize(self.pascal)
        self.upper = self.pascal.upper()

    def run(self):
        print(f"\n{Fore.RED}--- Starting Removal for {self.pascal} ---")
        
        confirm = questionary.confirm(
            f"⚠️  Are you sure you want to DELETE {self.pascal} files and remove code references? This cannot be undone.",
            default=False
        ).ask()

        if not confirm:
            print(f"{Fore.YELLOW}Operation cancelled.")
            return

        # 1. Delete standalone files
        self.delete_file(PATHS['models'] / f"{self.camel}.model.ts")
        self.delete_file(PATHS['resolvers'] / f"{self.camel}.ts")

        # 2. Clean shared files
        self.clean_models_types()
        self.clean_graphql_types()
        self.clean_typedefs()
        self.clean_resolver_index()
        self.clean_loaders()

        print(f"\n{Fore.GREEN}{Style.BRIGHT}🗑️  Cleanup completed for {self.pascal}!")

    def delete_file(self, path):
        if path.exists():
            try:
                os.remove(path)
                print(f"{Fore.RED}    ❌ Deleted {path.name}")
            except Exception as e:
                print(f"{Fore.RED}    ⚠️ Failed to delete {path.name}: {e}")
        else:
            print(f"{Fore.YELLOW}    ℹ️  File {path.name} not found, skipping.")

    def _read(self, path):
        if not path.exists(): return None
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def _write(self, path, content):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

    # ---------------------------------------------------------
    # Clean Types/Models.ts
    # ---------------------------------------------------------
    def clean_models_types(self):
        path = PATHS['types'] / "models.ts"
        content = self._read(path)
        if not content: return

        # Regex to remove export interface EntityType { ... }
        # Matches 'export interface PascalType', non-greedy content until closing brace at start of line
        pattern = rf"export interface {self.pascal}Type\s*\{{.*?^\}}"
        
        # Use re.MULTILINE | re.DOTALL to handle newlines inside the block
        new_content = re.sub(pattern, "", content, flags=re.MULTILINE | re.DOTALL)
        
        # Clean up double newlines left behind
        new_content = re.sub(r'\n\s*\n', '\n\n', new_content)

        if len(content) != len(new_content):
            self._write(path, new_content.strip() + '\n')
            print(f"{Fore.BLUE}    ✏️  Removed {self.pascal}Type from types/models.ts")

    # ---------------------------------------------------------
    # Clean Types/Graphql.ts
    # ---------------------------------------------------------
    def clean_graphql_types(self):
        path = PATHS['types'] / "graphql.ts"
        content = self._read(path)
        if not content: return

        # 1. Remove Import from models.js
        # Pattern: PascalType, (with optional whitespace/newlines)
        content = re.sub(rf"\s*{self.pascal}Type,?", "", content)

        # 2. Remove Loader definition
        # Pattern: camelLoader: DataLoader<string, PascalType | null>;
        loader_pattern = rf"\s*{self.camel}Loader:\s*DataLoader<.*?>;"
        content = re.sub(loader_pattern, "", content)

        self._write(path, content)
        print(f"{Fore.BLUE}    ✏️  Removed refs from types/graphql.ts")

    # ---------------------------------------------------------
    # Clean Schemas/TypeDefs.ts
    # ---------------------------------------------------------
    def clean_typedefs(self):
        path = PATHS['schemas'] / "typeDefs.ts"
        content = self._read(path)
        if not content: return

        # Remove main type definitions
        patterns = [
            rf"\s*type {self.pascal}\s*\{{.*?^\s*\}}", # Type
            rf"\s*input {self.pascal}(Input|Filter|Sort)\s*\{{.*?^\s*\}}", # Inputs
            rf"\s*type {self.pascal}Connection\s*\{{.*?^\s*\}}", # Connection
        ]

        for p in patterns:
            content = re.sub(p, "", content, flags=re.MULTILINE | re.DOTALL)

        # Remove lines inside Query/Mutation/Subscription extensions
        keywords = [
            f"getOne{self.pascal}",
            f"{self.plural}(", 
            f"create{self.pascal}",
            f"update{self.pascal}",
            f"delete{self.pascal}",
            f"{self.camel}Added"
        ]
        
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if not any(k in line for k in keywords):
                new_lines.append(line)
        
        content = '\n'.join(new_lines)
        
        # Clean up empty lines created by removals
        content = re.sub(r'\n{3,}', '\n\n', content)

        # =========================================================
        # FIX: Remove empty extension blocks to prevent Syntax Error
        # =========================================================
        # Looks for "extend type Query { }" with optional whitespace
        empty_block_pattern = r"extend type (Query|Mutation|Subscription)\s*\{\s*\}"
        
        # We run this in a loop just in case nested cleaning leaves multiples (unlikely but safe)
        while re.search(empty_block_pattern, content):
            content = re.sub(empty_block_pattern, "", content, flags=re.MULTILINE)
            print(f"{Fore.CYAN}    🧹 Cleaned empty extension block")

        self._write(path, content)
        print(f"{Fore.BLUE}    ✏️  Removed refs from schemas/typeDefs.ts")

    # ---------------------------------------------------------
    # Clean Resolvers/Index.ts
    # ---------------------------------------------------------
    def clean_resolver_index(self):
        path = PATHS['resolvers'] / "index.ts"
        content = self._read(path)
        if not content: return

        # 1. Remove Import
        import_line = rf'import {{ {self.camel}Resolvers }} from "./{self.camel}.js";'
        content = content.replace(import_line, "")

        # 2. Remove Spreads
        # Pattern: ...camelResolvers.Query, (etc)
        spread_pattern = rf"\s*\.\.\.{self.camel}Resolvers\.(Query|Mutation|Subscription),"
        content = re.sub(spread_pattern, "", content)

        # Cleanup extra newlines
        content = re.sub(r'\n\s*\n', '\n', content)

        self._write(path, content)
        print(f"{Fore.BLUE}    ✏️  Removed refs from resolvers/index.ts")

    # ---------------------------------------------------------
    # Clean Utils/Loaders.ts
    # ---------------------------------------------------------
    def clean_loaders(self):
        path = PATHS['utils'] / "loaders.ts"
        content = self._read(path)
        if not content: return

        # 1. Remove Model Import
        model_imp = rf'import {self.pascal} from "../models/{self.camel}.model.js";'
        content = content.replace(model_imp, "")

        # 2. Remove Type Import reference
        content = re.sub(rf"\s*{self.pascal}Type,?", "", content)

        # 3. Remove Prefix Constant
        # const UPPER_PREFIX = "camel:";
        prefix_pattern = rf'const {self.upper}_PREFIX = "{self.camel}:";'
        content = content.replace(prefix_pattern, "")

        # 4. Remove Fields Constant
        # const camelFields = "...";
        fields_pattern = rf'\s*const {self.camel}Fields = ".*?";'
        content = re.sub(fields_pattern, "", content)

        # 5. Remove Loader Instance Block
        # Matches: camelLoader: new DataLoader<... ( greedy until ), )
        loader_block = rf"\s*{self.camel}Loader:\s*new DataLoader[\s\S]*?\),"
        content = re.sub(loader_block, "", content)

        # Cleanup whitespace
        content = re.sub(r'\n{3,}', '\n\n', content)

        self._write(path, content)
        print(f"{Fore.BLUE}    ✏️  Removed refs from utils/loaders.ts")

# ==========================================
# 3. INTERFACE
# ==========================================

def run():
    print(f"\n{Fore.RED}{Style.BRIGHT}🗑️  Entity Remover Tool 🗑️ \n")
    
    entity_name = questionary.text("Enter Entity Name to REMOVE (e.g. Ticket):").ask()
    
    if not entity_name:
        print("No name entered. Exiting.")
        return

    cleaner = Cleaner(entity_name)
    cleaner.run()

if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        print("\nCancelled.")