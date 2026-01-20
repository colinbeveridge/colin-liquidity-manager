Run Instructions for Liquidity Manager

1. In order to run the project, you will need to run on macOS or Linux
2. Install sdkman: `curl -s "https://get.sdkman.io" | bash`
   1. Source new path: `source "$HOME/.sdkman/bin/sdkman-init.sh"`
   2. Install Java 21 Corretto: `sdk install java 21.0.9-amzn`
   3. Switch Terminal to JDK 21: `sdk use java 21.0.9-amzn`
3. Check if Homebrew is installed: `brew --version`
4. If this command returns `Homebrew x.x.x`, skip to step n
   1. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   2. Source bash file: `source ~/.bashrc`
5. Install npm using Homebrew: `brew install npm`
6. Go to this project's directory
7. Run: `./start.sh`
8. Use the application at this link: http://localhost:5173/