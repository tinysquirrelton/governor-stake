npm install
npm uninstall governor-common
npm install https://github.com/tinysquirrelton/governor-common.git
RANDDIR="temp_build_$(openssl rand -hex 12)"
BUILD_PATH=$RANDDIR npm run build
rm -rf build
mv $RANDDIR build