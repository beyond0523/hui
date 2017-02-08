var gulp = require('gulp'),
    // 启动参数获取
    yargs = require('yargs').argv,
    // sass编译
    sass = require('gulp-sass'),
    // 多个文件合并
    concat = require('gulp-concat'),
    // js压缩
    uglify = require('gulp-uglify'),
    // ejs模板编译为html
    // ejs = require('gulp-ejs'),
    // html压缩
    html = require('gulp-htmlmin'),
    // 数据获取
    // data = require('gulp-data'),
    // css压缩
    cssuglify = require("gulp-clean-css"),
    // 删除文件
    del = require('del'),
    // 添加浏览器前缀
    // autoprefixer = require('gulp-autoprefixer'),
    // nunjucks模板解析
    nunjucks  = require('gulp-nunjucks-render'),
    // 浏览器同步刷新
    sync = require('browser-sync'),
    // 重命名
    rename = require('gulp-rename');

// 路径配置
var path = {
    // js原文件路径
    jsSrc: [
        './src/js/mui.js',
        './src/js/mui.detect.js',
        './src/js/mui.detect.5+.js',
        './src/js/mui.event.js',
        './src/js/mui.target.js',
        './src/js/mui.fixed.js',
        './src/js/mui.fixed.bind.js',
        './src/js/mui.fixed.classlist.js',
        './src/js/mui.fixed.animation.js',
        './src/js/mui.fixed.fastclick.js',
        './src/js/mui.fixed.keyboard.js',
        './src/js/mui.namespace.js',
        './src/js/mui.gestures.js',
        './src/js/mui.gestures.flick.js',
        './src/js/mui.gestures.swipe.js',
        './src/js/mui.gestures.drag.js',
        './src/js/mui.gestures.tap.js',
        './src/js/mui.gestures.longtap.js',
        './src/js/mui.gestures.hold.js',
        './src/js/mui.gestures.pinch.js',
        './src/js/mui.init.js',
        './src/js/mui.init.5+.js',
        './src/js/mui.back.js',
        './src/js/mui.back.5+.js',
        './src/js/mui.init.pullrefresh.js',
        './src/js/mui.ajax.js',
        './src/js/mui.ajax.5+.js',
        './src/js/mui.layout.js',
        './src/js/mui.animation.js',
        './src/js/mui.class.js',
        './src/js/mui.pullRefresh.js',
        './src/js/mui.class.scroll.js',
        './src/js/mui.class.scroll.pullrefresh.js',
        './src/js/mui.class.scroll.slider.js',
        './src/js/pullrefresh.5+.js',
        './src/js/mui.offcanvas.js',
        './src/js/actions.js',
        './src/js/modals.js',
        './src/js/popovers.js',
        './src/js/segmented-controllers.js',
        './src/js/switches.js',
        './src/js/tableviews.js',
        './src/js/mui.dialog.alert.js',
        './src/js/mui.dialog.confirm.js',
        './src/js/mui.dialog.prompt.js',
        './src/js/mui.dialog.toast.js',
        './src/js/mui.popup.js',
        './src/js/mui.progressbar.js',
        './src/js/input.plugin.js',
        './src/js/mui.transparent.js',
        './src/js/mui.number.js',
        './src/js/mui.button.js'
    ],
    // js编译后路径
    jsDist: "./dist/js",
    // css编译后路径
    cssDist: "./dist/css"
},
// html压缩选项
options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

// 编译Sass后合并压缩css文件
gulp.task('compileCSS', ["cleanCSS"], function() {
    gulp.src("./src/sass/mui.scss")
        .pipe(sass())
        // .pipe(autoprefixer())
        .pipe(gulp.dest(path.cssDist))
        .pipe(rename('mui.min.css'))
        .pipe(cssuglify())
        .pipe(gulp.dest(path.cssDist));
});

// 删除css文件
gulp.task("cleanCSS", function(cb) {
    return del(["./dist/css/mui.css","./dist/css/mui.min.css"], cb);
});

// 合并压缩js文件
gulp.task('compileJS', ["cleanJS"], function() {
    gulp.src(path.jsSrc)
        .pipe(concat('mui.js'))
        .pipe(gulp.dest(path.jsDist))
        .pipe(rename('mui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.jsDist));
});

// 删除js文件
gulp.task("cleanJS", function(cb) {
    return del(["./dist/js/mui.js","./dist/js/mui.min.js"], cb);
});

// 获取数据
function getData(file){
    console.log(file.data);
}

// 编译并复制上层html
gulp.task("copyTHtml",function(){
    gulp.src("./src/*.html")
        // .pipe(ejs({}))
        // .pipe(data(getData))
        .pipe(nunjucks({}))
        .pipe(html(options))
        .pipe(gulp.dest("./dist"));
});

// 编译并复制下层html
gulp.task("copyBHtml",function(){
    gulp.src(["./src/html/*.html","!./src/html/_*.html"])
        // .pipe(ejs({}))
        .pipe(html(options))
        .pipe(gulp.dest("./dist/html/"));
});

// 复制图片
gulp.task("copyImg",function(){
	gulp.src("./src/img/*")
		.pipe(gulp.dest("./dist/img/"));
});

// 复制字体文件
gulp.task("copyFont",function(){
	gulp.src("./src/font/*")
		.pipe(gulp.dest("./dist/font/"));
});

// 复制静态资源
gulp.task("copy",["copyTHtml","copyBHtml","copyImg","copyFont"]);

// 启动服务
gulp.task("server",function(){
    yargs.p = yargs.p || 8080;
    sync.init({
        server : {
            baseDir : "./"
        },
        ui: {
            port: yargs.p + 1,
            weinre : {
                port: yargs.p+2
            }
        },
        port: yargs.p,
        startPath:"./dist/"
    });
});

// 监听任务
gulp.task("monitor",function(){
    gulp.watch(['./src/js/**/*.js'], ["compileJS"]);
    gulp.watch(['./src/sass/**/*.scss',], ["compileCSS"]);
    gulp.watch(["./src/*.html"], ["copyTHtml"]);
    gulp.watch(["./src/html/*.html"], ["copyBHtml"]);
    gulp.watch(["./src/img/*"], ["copyImg"]);
    gulp.watch(["./src/font/*"], ["copyFont"]);
    gulp.watch(["./gulpfile.js"], ["default"]);
}); 

// 默认任务
gulp.task('default',["compileCSS", "compileJS", "copy"], function() {
    if (yargs.s){
        gulp.start("server");
    }
    if (yargs.w){
        gulp.start("monitor");
    }
});
