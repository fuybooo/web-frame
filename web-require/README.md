#modularization

测试项目，技能综合运用

##项目环境

#####requirejs + angularjs + gulp + npm

##目录结构

    │  .gitignore
    │  bower.json
    │  favicon.ico
    │  gulpfile.js
    │  index.html
    │  LICENSE
    │  modularization.tree.txt
    │  package.json
    │  README.md
    │
    ├─.idea
    │  │  misc.xml
    │  │  modularization.iml
    │  │  modules.xml
    │  │  vcs.xml
    │  │  workspace.xml
    │  │
    │  ├─dictionaries
    │  │      fuybooo.xml
    │  │
    │  └─inspectionProfiles
    │          Project_Default.xml
    │
    ├─app
    │  ├─images
    │  │      logo.png
    │  │      logo16-16.png
    │  │      logo32-32.png
    │  │      logo48-48.png
    │  │
    │  ├─json
    │  │      login.json
    │  │
    │  ├─scripts
    │  │  ├─common
    │  │  │      common-service.js
    │  │  │      data-service.js
    │  │  │      common-directive.js
    │  │  │      popupwin-service.js
    │  │  │
    │  │  ├─configs
    │  │  │      app.js
    │  │  │      config.js
    │  │  │      router.js
    │  │  │
    │  │  ├─home
    │  │  │      home-controller.js
    │  │  │      home-directive.js
    │  │  │
    │  │  └─login
    │  │          login-controller.js
    │  │          login-directive.js
    │  │          login-filter.js
    │  │          register-controller.js
    │  │          register-directive.js
    │  │
    │  ├─styles
    │  │      base.css
    │  │      popupwin.css
    │  │      style.css
    │  │
    │  ├─vendor
    │  │
    │  └─views
    │          app.html
    │          dashboard.html
    │          home.html
    │          login-box.html
    │          login.html
    │          nav.html
    │          register-box.html
    │          register.html
    │
    ├─node_modules
    └─test
        │  karma.conf.js
        │  test-main.js
        │
        ├─private-test
        │      amaze-ui.html
        │
        └─unit
                karma-require-test-Spec.js


##使用说明

搭建好环境之后，执行gulp即可

##开发工具

#####推荐webstorm