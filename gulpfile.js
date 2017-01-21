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
    // 自動添加瀏覽器前綴
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
        .pipe(rename('mui.min.css'))
        .pipe(cssuglify())
        .pipe(rev())
        .pipe(gulp.dest(path.cssDist));
});

// 删除css文件
gulp.task("cleanCSS", function(cb) {
    return del(["./dist/css/*.css"], cb);
});

// 合并压缩js文件
gulp.task('compileJS', ["cleanJS"], function() {
    gulp.src(path.jsSrc)
        .pipe(concat('h.js'))
        .pipe(rename('h.min.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(path.jsDist));
});

// 删除js文件
gulp.task("cleanJS", function(cb) {
    return del(["./dist/js/*.js"], cb);
});

// 複製靜態資源
gulp.task("copy",function(){
	gulp.src("./src/img/*")
		.pipe(gulp.dist("./dist/img/"));
	gulp.src("./src/font/*")
		.pipe(gulp.dist("./dist/font/"));
	gulp.src("./src/html/*")
		.pipe(gulp.dist("./dist/html/"));
	gulp.src("./src/*.html")
		.pipe(gulp.dist("./dist/"));
});

// 默认任务
gulp.task('default',["compileCSS", "compileJS", "copy"], function() {
    // 监听文件变化
    gulp.watch(['./src/js/**/*.js'], ["compileJS"]);
    gulp.watch(['./src/sass/**/*.scss',], ["compileCSS"]);
    gulp.watch(["./src/*.html", "./src/html/*.html"], ["copy"]);
});