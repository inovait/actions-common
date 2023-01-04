set -o xtrace

$ANDROID_HOME/emulator/emulator -no-window -read-only -avd Nexus_5_API_30 -no-snapshot-save -no-audio -gpu swiftshader_indirect -skin 1080x1920 &
emulatorPid=$!
adb wait-for-device
$@
testStatus=$?
kill $emulatorPid
echo "  [X] Waiting for emulator to terminate..."
while kill -0 $emulatorPid 2> /dev/null; do sleep 1; done;
exit $testStatus


