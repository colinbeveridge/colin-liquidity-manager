Run Instructions for Liquidity Manager

1. In order to run the project, you will need to run on macOS or Linux. Start a new terminal window and clone the project: 
   1. `git clone https://github.com/colinbeveridge/colin-liquidity-manager.git`
2. Install and use java 21 with sdkman:
   1. Install sdkman: `curl -s "https://get.sdkman.io" | bash`
   2. Init sdkman: `source "$HOME/.sdkman/bin/sdkman-init.sh"`
   3. Install Java 21 Corretto: `sdk install java 21.0.9-amzn`
   4. Switch Terminal to JDK 21: `sdk use java 21.0.9-amzn`
3. Check if Homebrew is installed: `brew --version`
4. If this command returns `Homebrew x.x.x`, skip to step 5, else proceed with below:
   1. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   2. When the above command completes, it will provide three lines to add Homebrew to your path. Copy and run these lines.
   3. Source bash file: `source ~/.bashrc`
5. Install npm using Homebrew: `brew install npm`
6. Go to this project's directory
7. Run: `./start.sh`
8. Use the application at this link: http://localhost:5173/
9. To close the application: `Ctrl+C`