
echo git tag: $TRAVIS_TAG
echo username : env.username
echo password: env.password

if [ $TRAVIS_TAG ] && [ "$TRAVIS_TAG"x != ""x ]; then

    if [ `echo $TRAVIS_TAG | grep "^plugin_[0-9]\+\.[0-9]\+\.[0-9]\+$"` ]; then
        
        # nexus
        echo ''
        echo '[is a tag] start packing'
        npm config set registry https://registry.npm.taobao.org
        cd kefu-webim
        cd server
        npm install
        cd ../
        npm install
        npm run build -- --tag-name=$TRAVIS_TAG


        deploy:
            provider: releases
            user: env.username
            password: env.password
            file: "FILE TO UPLOAD"
            skip_cleanup: true
        on:
            tags: true

     else
        echo ''
        echo 'The format of the tag is not correct.'

    fi

else 

echo ''
echo '[not a tag] exit packing.'

fi