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

PATHS = {
    'models': SRC_DIR / 'models',
    'resolvers': SRC_DIR / 'resolvers',
    'schemas': SRC_DIR / 'schemas',
    'types': SRC_DIR / 'types',
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

# ==========================================
# 2. VIEWER LOGIC
# ==========================================

class EntityViewer:
    def __init__(self):
        self.entities = []
        self.type_defs_content = ""
        self._load_typedefs()

    def _load_typedefs(self):
        """Loads typeDefs.ts once into memory to avoid repeated IO."""
        path = PATHS['schemas'] / "typeDefs.ts"
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                self.type_defs_content = f.read()
        else:
            self.type_defs_content = ""

    def scan(self):
        """Scans the models directory to find entities."""
        if not PATHS['models'].exists():
            # Replaced ❌ with [!]
            print(f"{Fore.RED}[!] Models directory not found at {PATHS['models']}")
            return []

        # Find all *.model.ts files
        files = list(PATHS['models'].glob("*.model.ts"))
        
        # Extract base name (e.g., 'ticket.model.ts' -> 'ticket')
        self.entities = sorted([f.name.replace(".model.ts", "") for f in files])
        return self.entities

    def check_schema_presence(self, pascal_name):
        """Checks if the entity exists in the loaded typeDefs content."""
        if not self.type_defs_content:
            return False
        pattern = rf"type {pascal_name}\s*\{{"
        return bool(re.search(pattern, self.type_defs_content))

    def summarize_system(self, found_entities):
        """Prints a high-level summary of all entities and their health."""
        total = len(found_entities)
        missing_resolvers = 0
        missing_schemas = 0
        
        # Analyze
        for raw_name in found_entities:
            camel = Utils.camel_case(raw_name)
            pascal = Utils.pascal_case(raw_name)
            
            # Check Resolver
            resolver_path = PATHS['resolvers'] / f"{camel}.ts"
            if not resolver_path.exists():
                missing_resolvers += 1
            
            # Check Schema
            if not self.check_schema_presence(pascal):
                missing_schemas += 1

        # Determine Colors
        res_color = Fore.RED if missing_resolvers > 0 else Fore.GREEN
        sch_color = Fore.RED if missing_schemas > 0 else Fore.GREEN
        
        # Print Box
        print(f"\n{Fore.CYAN}╔════════════════════════════════════════════╗")
        print(f"{Fore.CYAN}║             SYSTEM HEALTH SUMMARY          ║")
        print(f"{Fore.CYAN}╠════════════════════════════════════════════╣")
        print(f"{Fore.CYAN}║ {Fore.WHITE}Total Models Found : {Style.BRIGHT}{str(total).ljust(19)}{Fore.CYAN} ║")
        print(f"{Fore.CYAN}║ {Fore.WHITE}Missing Resolvers  : {res_color}{str(missing_resolvers).ljust(19)}{Fore.CYAN} ║")
        print(f"{Fore.CYAN}║ {Fore.WHITE}Missing in Schema  : {sch_color}{str(missing_schemas).ljust(19)}{Fore.CYAN} ║")
        print(f"{Fore.CYAN}╚════════════════════════════════════════════╝\n")

        if missing_resolvers > 0 or missing_schemas > 0:
            print(f"{Fore.YELLOW}{Style.DIM}Tip: Select an entity below to see specifically which files are missing.\n")

    def get_schema_preview(self, pascal_name):
        """Extracts the fields from the pre-loaded typeDefs content."""
        if not self.type_defs_content:
             return f"{Fore.YELLOW}  (typeDefs.ts not found or empty)"

        pattern = rf"type {pascal_name}\s*\{{([\s\S]*?)\n\s*\}}"
        match = re.search(pattern, self.type_defs_content)

        if match:
            raw_fields = match.group(1).strip().split('\n')
            cleaned_fields = [line.strip() for line in raw_fields if line.strip()]
            return "\n".join([f"    {Fore.CYAN}{field}" for field in cleaned_fields])
        else:
            return f"{Fore.YELLOW}  (Schema definition not found in typeDefs.ts)"

    def show_details(self, raw_name):
        """Displays details for a selected entity."""
        pascal = Utils.pascal_case(raw_name)
        camel = Utils.camel_case(raw_name)

        print(f"\n{Fore.GREEN}{Style.BRIGHT}==========================================")
        # Replaced 🔍 with [I]
        print(f" [I] ENTITY DETAILS: {Fore.WHITE}{pascal}")
        print(f"{Fore.GREEN}==========================================\n")

        # 1. File Locations
        # Replaced 📂 with [D]
        print(f"{Fore.YELLOW}{Style.BRIGHT}[D] File Locations:")
        
        files = [
            ("Model", PATHS['models'] / f"{camel}.model.ts"),
            ("Resolver", PATHS['resolvers'] / f"{camel}.ts"),
        ]

        for label, path in files:
            # Replaced ✔ and ✖ with [OK] and [FAIL]
            status = f"{Fore.GREEN}[OK] Found" if path.exists() else f"{Fore.RED}[FAIL] Missing"
            print(f"  • {label.ljust(10)}: {status} {Style.DIM}({path.name})")

        # 2. Schema Preview
        # Replaced 📜 with [S]
        print(f"\n{Fore.YELLOW}{Style.BRIGHT}[S] GraphQL Schema:")
        print(f"{Fore.MAGENTA}  type {pascal} {{")
        print(self.get_schema_preview(pascal))
        print(f"{Fore.MAGENTA}  }}")
        print("")

    def run(self):
        # Replaced 🔍 with [I]
        print(f"\n{Fore.BLUE}{Style.BRIGHT}[I] Entity Viewer Tool v1.1 [I]")
        
        found_entities = self.scan()

        if not found_entities:
            print(f"{Fore.YELLOW}No entities found in {PATHS['models']}.")
            return

        # NEW: Show the summary before asking for input
        self.summarize_system(found_entities)

        choices = [Utils.pascal_case(e) for e in found_entities]
        choices.append("Exit")

        while True:
            # Interactive Selection
            selected = questionary.select(
                "Select an Entity to view details:",
                choices=choices
            ).ask()

            if not selected or selected == "Exit":
                print("Bye! 👋")
                break

            # Find the raw camel/lower name based on selection
            raw_name = next(e for e in found_entities if Utils.pascal_case(e) == selected)
            self.show_details(raw_name)
            
            # Pause before showing list again
            questionary.press_any_key_to_continue().ask()

if __name__ == '__main__':
    try:
        viewer = EntityViewer()
        viewer.run()
    except KeyboardInterrupt:
        print("\nCancelled.")