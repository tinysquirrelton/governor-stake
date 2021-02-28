npm install
npm uninstall governor-common
npm install https://github.com/tinysquirrelton/governor-common.git
BUILD_PATH=temp_build npm run build
rm -rf build
mv temp_build build
