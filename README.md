# sup
simple screenshot upload tool for OSX.

take screenshot -> automatically upload -> get a desktop notification and the url on your clipboard

install with
  `$ git clone https://github.com/strong-code/sup.git && cd sup && [sudo] npm install forever -g`

run with
  `$ forever start sup.js`

# Config

Edit `config.json` with the *absolute* path of wherever you save your screenshots.

# FAQs
To change the save path of OSX's screenshot tool, use `defaults write com.apple.screencapture location /new/path/here/` then `killall SystemUIServer`.

Sometimes the OSX notification center can freeze. You can restart it with `launchctl load -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist`

If you are using this inside tmux, add the following to your `~/.bash_rc` file: `alias terminal-notifier='reattach-to-user-namespace terminal-notifier'`
