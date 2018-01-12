
echo git tag: $TRAVIS_TAG
echo nexus_user: ${nexus_user}
echo nuxes_password: ${nuxes_password}

if [ $TRAVIS_TAG ] && [ "$TRAVIS_TAG"x != ""x ]; then

    if [ `echo $TRAVIS_TAG | grep "^plugin_[0-9]\+\.[0-9]\+\.[0-9]\+_final$"` ] || [ `echo $TRAVIS_TAG | grep "^plugin_[0-9]\+\.[0-9]\+\.[0-9]\+_snapshot$"` ]; then
        
        # nexus
        echo ''
        echo '[is a tag] start packing'
        npm config set registry https://registry.npm.taobao.org
        
        npm install
        npm run build -- --tag-name=$TRAVIS_TAG
        echo ''
        echo "build result" 
        pwd
        ls    
        echo ""
        echo "webpack"
        cat webpack.config.js | head -n 20
        cd ../
        zip -q -r kefu-webim-${TRAVIS_TAG}.zip --exclude=kefu-webim/appPageCached.js --exclude=kefu-webim/node_modules ./kefu-webim
        echo ''
        echo "tar result" 
        ls

        # mode="final"
        # package= "com.easemob.robot.webim.production" | "com.easemob.robot.webim.development"
        # repo="robot-ui-webim"
        # ver="robot_webim_1.2.3.final" | "robot_webim_1.2.3.snapshot"
        # target= @${TRAVIS_BUILD_DIR}/../kefu-webim.tar.gz
        # "curl -v " +
        # "-F r=${mode} " +
        # "-F hasPom=false " +
        # "-F e=zip " +
        # "-F g=${package} " +
        # "-F a=${repo} " +
        # "-F v=${ver} " +
        # "-F p=zip " +
        # "-F file=@${target} " +
        # "-u" +${server_name}+":"+${server_password}+" http://hk.nexus.op.easemob.com/nexus/service/local/artifact/maven/content\n";


     else

        echo ''
        echo 'The format of the tag is not correct.'

    fi

else 

echo ''
echo '[not a tag] exit packing.'

fi