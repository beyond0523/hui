var gulp = require('gulp'),
    // sass编译
    sass = require('gulp-sass'),
    // 多个文件合并
    concat = require('gulp-concat'),
    // js压缩
    uglify = require('gulp-uglify'),
    // css压缩
    cssuglify = require("gulp-clean-css"),
    // 删除文件
    del = require('del'),
    // 添加浏览器前缀
    autoprefixer = require('gulp-autoprefixer'),
    // 重命名
    rename = require('gulp-rename');

// 路径配置
var path = {
    // js原文件路径
    jsSrc: "./src/js/*.js",
    // js编译后路径
    jsDist: "./dist/js",
    // css编译后路径
    cssDist: "./dist/css"
};

// 编译Sass后合并压缩css文件
gulp.task('compileCSS', ["cleanCSS"], function() {
    gulp.src("./src/sass/mui.scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.cssDist))
        .pipe(rename('mui.min.css'))
        .pipe(cssuglify())
        .pipe(gulp.dest(path.cssDist));
});

// 删除css文件
gulp.task("cleanCSS", function(cb) {
    return del(["./dist/css/*.css"], cb);
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
    return del(["./dist/js/*.js"], cb);
});

// 复制上层html
gulp.task("copyTHtml",function(){
    gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist"));
});

// 复制下层html
gulp.task("copyBHtml",function(){
    gulp.src("./src/html/*")
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

// 默认任务
gulp.task('default',["compileCSS", "compileJS", "copy"], function() {
    // 监听文件变化
    gulp.watch(['./src/js/**/*.js'], ["compileJS"]);
    gulp.watch(['./src/sass/**/*.scss',], ["compileCSS"]);
    gulp.watch(["./src/*.html"], ["copyTHtml"]);
    gulp.watch(["./src/html/*.html"], ["copyBHtml"]);
    gulp.watch(["./src/img/*"], ["copyImg"]);
    gulp.watch(["./src/font/*"], ["copyFont"]);
});
