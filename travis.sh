
echo git tag: $TRAVIS_TAG

if [ $TRAVIS_TAG ] && [ "$TRAVIS_TAG"x != ""x ]; then

    if [ `echo $TRAVIS_TAG | grep "^plugin_[0-9]\+\.[0-9]\+\.[0-9]\+$"` ]; then
        
        # nexus
        echo ''
        echo '[is a tag] start packing'
        npm config set registry https://registry.npm.taobao.org
        cd server
        npm install
        cd ../
        npm install
        npm run build -- --tag-name=$TRAVIS_TAG
        echo ''
        echo "build result" 
        pwd
        ls
        cat webpack.config.js     
        cd ../
        tar -zcvf kefu-webim.tar.gz --exclude=kefu-webim/appPageCached.js   
        tar -zcvf kefu-webim.tar.gz --exclude=kefu-webim/node_modules  
        echo ''
        echo "tar result" 
        cd ../
        ls

     else
        echo ''
        echo 'The format of the tag is not correct.'

    fi

else 

echo ''
echo '[not a tag] exit packing.'

fi