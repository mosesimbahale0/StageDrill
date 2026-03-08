# import os
# import sys
# import json
# import subprocess
# import questionary
# from rich.console import Console
# from rich.panel import Panel
# from rich.text import Text
# from rich.style import Style

# # Initialize Rich Console
# console = Console()

# # ==========================================
# # 1. HELPERS
# # ==========================================

# def load_package_json():
#     """Reads the package.json file to parse scripts."""
#     if not os.path.exists('package.json'):
#         console.print("[bold red]❌ Error: package.json not found in the current directory.[/]")
#         return None
    
#     try:
#         with open('package.json', 'r') as f:
#             return json.load(f)
#     except json.JSONDecodeError:
#         console.print("[bold red]❌ Error: package.json is malformed.[/]")
#         return None

# def check_prerequisites():
#     """Checks for node_modules and .env file."""
    
#     # 1. Check .env
#     if not os.path.exists('.env'):
#         console.print("[yellow]⚠️  Warning: .env file is missing. Your app might fail to start if it requires environment variables.[/]")
    
#     # 2. Check node_modules
#     if not os.path.exists('node_modules'):
#         console.print("[bold red]🛑 'node_modules' missing.[/]")
#         should_install = questionary.confirm("Would you like to run 'npm install' now?").ask()
        
#         if should_install:
#             console.print("[cyan]📦 Installing dependencies...[/]")
#             try:
#                 # Use string command for shell=True to ensure arguments are passed correctly on POSIX
#                 subprocess.check_call("npm install", shell=True)
#                 console.print("[green]✔ Dependencies installed.[/]")
#             except subprocess.CalledProcessError:
#                 console.print("[red]❌ Failed to install dependencies.[/]")
#                 return False
#         else:
#             return False
            
#     return True

# def run_npm_command(script_name, description):
#     """Executes an npm script using subprocess."""
#     console.print(f"\n[bold purple]🚀 Executing: npm run {script_name}[/]")
#     console.print(f"[dim]{description}[/dim]\n")
    
#     try:
#         # We use shell=True to ensure npm is found on Windows/Linux environments easily
#         # We pass the full command as a string to ensure arguments aren't ignored on POSIX systems
#         subprocess.run(f"npm run {script_name}", shell=True, check=True)
#     except KeyboardInterrupt:
#         console.print(f"\n[yellow]🛑 Process stopped by user.[/]")
#     except subprocess.CalledProcessError:
#         console.print(f"\n[red]❌ The script 'npm run {script_name}' failed with an error.[/]")

# # ==========================================
# # 2. MAIN SCRIPT
# # ==========================================

# def run_project_script():
#     console.print(Panel("[bold cyan]Node.js Project Runner[/]", border_style="cyan"))
    
#     # 1. Validation
#     pkg = load_package_json()
#     if not pkg: 
#         return

#     if not check_prerequisites():
#         console.print("[red]Cannot start project without dependencies.[/]")
#         return

#     # 2. Analyze Scripts from package.json
#     scripts = pkg.get('scripts', {})
    
#     # Define descriptions for known scripts in your specific package.json
#     descriptions = {
#         "dev": "Starts development server with TypeScript watch mode",
#         "dev:server": "Runs dev server + nodemon concurrently",
#         "build": "Cleans ./dist and recompiles TypeScript",
#         "start": "Runs the production build (node ./dist/index.js)",
#         "lint": "Runs ESLint code analysis",
#         "compile": "Runs TSC only"
#     }

#     # Build Menu Options
#     choices = []
    
#     # Prioritize specific workflow scripts
#     priority_order = ["dev", "dev:server", "start", "build", "lint"]
    
#     for key in priority_order:
#         if key in scripts:
#             choices.append(questionary.Choice(
#                 title=f"{key.ljust(15)} - {descriptions.get(key, 'Run script')}",
#                 value=key
#             ))
            
#     # Add any other scripts found in package.json but not in priority list
#     for key in scripts:
#         if key not in priority_order:
#              choices.append(questionary.Choice(
#                 title=f"{key.ljust(15)} - Custom Script",
#                 value=key
#             ))

#     choices.append(questionary.Separator())
#     choices.append(questionary.Choice(title="❌ Exit", value="exit"))

#     # 3. Interactive Menu
#     selected_script = questionary.select(
#         "Select a command to run:",
#         choices=choices,
#         style=questionary.Style([
#             ('qmark', 'fg:#673ab7 bold'),
#             ('question', 'fg:#673ab7 bold'),
#             ('answer', 'fg:#2196f3 bold'),
#             ('pointer', 'fg:#673ab7 bold'),
#         ])
#     ).ask()

#     if selected_script == "exit" or selected_script is None:
#         console.print("[dim]Exiting runner.[/]")
#         return

#     # 4. Special Logic for Production Start
#     if selected_script == "start":
#         if not os.path.exists("dist"):
#             console.print("[bold yellow]⚠️  ./dist folder not found![/]")
#             should_build = questionary.confirm("Production build missing. Run 'npm run build' first?").ask()
#             if should_build:
#                 run_npm_command("build", descriptions["build"])
#             else:
#                 console.print("[dim]Attempting to start without build check...[/]")

#     # 5. Execute
#     run_npm_command(selected_script, descriptions.get(selected_script, "Custom script execution"))

# if __name__ == "__main__":
#     try:
#         run_project_script()
#     except KeyboardInterrupt:
#         console.print("\n[red]Process cancelled.[/]")


import os
import sys
import json
import platform
import subprocess
import shlex
import questionary
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.style import Style
from rich.theme import Theme
from rich.table import Table
from rich.align import Align
from rich import box

# ==========================================
# 0. CONFIGURATION & THEME
# ==========================================

custom_theme = Theme({
    "info": "cyan",
    "warning": "yellow",
    "error": "bold red",
    "success": "bold green",
    "primary": "bold blue",
    "muted": "dim white",
    "header": "bold white on blue",
})

console = Console(theme=custom_theme)

# Professional Symbols
SYMBOLS = {
    "arrow": "›",
    "check": "✔",
    "cross": "✖",
    "box": "▪",
    "win": "🗔", # Symbol for window
    "term": "",  # Symbol for terminal
    "pointer": "»" # Added missing pointer symbol
}

# Questionary Style
PRO_STYLE = questionary.Style([
    ('qmark', 'fg:#0078d4 bold'),
    ('question', 'fg:#ffffff bold'),
    ('answer', 'fg:#00bc7d bold'),
    ('pointer', 'fg:#0078d4 bold'),
    ('highlighted', 'fg:#0078d4 bold'),
    ('selected', 'fg:#00bc7d'),
])

# ==========================================
# 1. VISUAL HELPERS
# ==========================================

def print_header():
    os.system('cls' if os.name == 'nt' else 'clear')
    
    title = Text(" NODE.JS CONTROL CENTER ", style="bold white on blue")
    subtitle = Text(f" v1.0 {SYMBOLS['box']} Process Manager", style="dim white")
    
    console.print(Align.center(title))
    console.print(Align.center(subtitle))
    console.print(Text("─" * console.width, style="dim blue"))

def print_health_table(checks):
    """Renders a status table for prerequisites."""
    table = Table(box=box.SIMPLE, show_header=True, header_style="bold blue", expand=True)
    table.add_column("Status", width=8, justify="center")
    table.add_column("Component")
    table.add_column("Details", style="dim")

    for item in checks:
        icon = f"[success]{SYMBOLS['check']}[/]" if item['passed'] else f"[error]{SYMBOLS['cross']}[/]"
        table.add_row(icon, item['name'], item['details'])

    console.print(table)
    console.print("")

# ==========================================
# 2. DETACHED PROCESS LOGIC
# ==========================================

def spawn_new_terminal(command):
    """
    Opens a NEW terminal window and runs the command.
    Implementation varies by Operating System.
    """
    system = platform.system()
    
    try:
        if system == "Windows":
            # Opens a new Command Prompt window and keeps it open (/k)
            subprocess.Popen(f'start cmd /k "{command}"', shell=True)
            
        elif system == "Darwin": # macOS
            # Uses AppleScript to tell Terminal app to do the script
            # Escape quotes for AppleScript
            safe_cmd = command.replace('"', '\\"')
            subprocess.Popen([
                'osascript', '-e',
                f'tell application "Terminal" to do script "{safe_cmd}" activate'
            ])
            
        elif system == "Linux":
            # Tries common terminal emulators
            # You might need to adjust this list based on what is installed (gnome-terminal, xterm, etc.)
            terminals = ["gnome-terminal", "x-terminal-emulator", "xterm"]
            started = False
            for term in terminals:
                try:
                    # gnome-terminal requires '--' before command
                    if term == "gnome-terminal":
                         subprocess.Popen([term, "--", "bash", "-c", f"{command}; exec bash"])
                    else:
                         subprocess.Popen([term, "-e", f"{command}; read -p 'Press Enter to close...'"])
                    started = True
                    break
                except FileNotFoundError:
                    continue
            
            if not started:
                console.print("[error]❌ Could not find a supported terminal emulator (gnome-terminal/xterm).[/]")
                return False

        return True
    except Exception as e:
        console.print(f"[error]Failed to spawn terminal: {e}[/]")
        return False

# ==========================================
# 3. CORE LOGIC
# ==========================================

def load_package_json():
    if not os.path.exists('package.json'):
        return None
    try:
        with open('package.json', 'r') as f:
            return json.load(f)
    except:
        return None

def run_health_check():
    checks = []
    
    # Check .env
    has_env = os.path.exists('.env')
    checks.append({
        "name": "Environment Config",
        "passed": has_env,
        "details": ".env file found" if has_env else "Missing .env file (May cause crashes)"
    })
    
    # Check node_modules
    has_node = os.path.exists('node_modules')
    checks.append({
        "name": "Dependencies",
        "passed": has_node,
        "details": "node_modules installed" if has_node else "Modules missing"
    })
    
    print_health_table(checks)
    
    # Auto-fix node_modules
    if not has_node:
        if questionary.confirm("Install dependencies now?", style=PRO_STYLE).ask():
            with console.status("[bold cyan]Installing packages...[/]"):
                subprocess.run("npm install", shell=True)
            run_health_check() # Re-run check
            return True
        return False
    return True

def main():
    print_header()
    
    # 1. Validation
    pkg = load_package_json()
    if not pkg:
        console.print(Panel("[error]package.json not found![/]\nRun this in your project root.", border_style="red"))
        return

    if not run_health_check():
        return

    # 2. Menu Construction
    scripts = pkg.get('scripts', {})
    
    # Descriptions for common scripts
    descriptions = {
        "dev": "Development Server (Hot Reload)",
        "start": "Production Server",
        "build": "Compile Project",
        "lint": "Code Quality Check",
        "test": "Run Test Suite"
    }

    choices = []
    for key, cmd in scripts.items():
        desc = descriptions.get(key, cmd) # Use cmd string as fallback description
        # Truncate long descriptions
        if len(desc) > 40: desc = desc[:37] + "..."
        
        display = f"{key:<15} | {desc}"
        choices.append(questionary.Choice(title=display, value=key))

    choices.append(questionary.Separator())
    choices.append(questionary.Choice(title="❌ Exit", value="EXIT"))

    # 3. Selection Loop
    while True:
        script_name = questionary.select(
            "Select Command:",
            choices=choices,
            style=PRO_STYLE,
            pointer=SYMBOLS['pointer']
        ).ask()

        if not script_name or script_name == "EXIT":
            console.print("[muted]Exiting...[/]")
            break

        # 4. Mode Selection (Detached vs Inline)
        action = questionary.select(
            f"How do you want to run '{script_name}'?",
            choices=[
                questionary.Choice(f"{SYMBOLS['win']}  New Window (Detached)", value="detached"),
                questionary.Choice(f"{SYMBOLS['term']}  Current Terminal (Inline)", value="inline"),
                questionary.Choice("↩  Back", value="back")
            ],
            style=PRO_STYLE,
            pointer=SYMBOLS['pointer']
        ).ask()

        if action == "back":
            continue

        cmd_string = f"npm run {script_name}"

        if action == "detached":
            console.print(f"[success]{SYMBOLS['arrow']} Spawning new window for:[/success] [bold white]{script_name}[/]")
            spawn_new_terminal(cmd_string)
            console.print("[dim]You can continue using this terminal.[/dim]\n")
        
        else: # Inline
            console.print(f"[info]{SYMBOLS['arrow']} Running inline... (Ctrl+C to stop)[/info]")
            console.print(Text("─" * console.width, style="dim blue"))
            try:
                subprocess.run(cmd_string, shell=True)
            except KeyboardInterrupt:
                console.print("\n[warning]Stopped by user.[/]")
            print_header() # Clear screen and show menu again

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[error]Aborted.[/]")