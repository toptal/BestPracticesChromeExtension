/// <binding BeforeBuild='build' />

var gulp = require("gulp"),
    zip = require("gulp-zip"),
    rimraf = require("rimraf");

gulp.task("build", ["webextension", "edge"]);

// Web Extensions
gulp.task("webextension", function () {
    return gulp.src("app/**/*")
        .pipe(zip("WebDevelopChecklist.zip"))
        .pipe(gulp.dest("dist"));
});

//Edge
gulp.task("edge", ["edge:zip", "edge:copyfiles", "edge:copytodist", "edge:clean"]);

gulp.task("edge:copyfiles", function () {
    return gulp.src("edge/**/*")
        .pipe(gulp.dest("temp/edge"));
});

gulp.task("edge:copytodist", function () {
    return gulp.src("app/**/*")
        .pipe(gulp.dest("temp/edge/Extension"));
});

gulp.task("edge:zip", function () {
    return gulp.src("temp/edge/Extension/**/*")
        .pipe(zip("WebDevelopChecklist-Edge.zip"))
        .pipe(gulp.dest("dist"));
});

gulp.task("edge:clean", function (cb) {
    rimraf("temp");
    cb();
});
