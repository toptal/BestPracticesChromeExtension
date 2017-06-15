/// <binding BeforeBuild='build' />

var gulp = require("gulp"),
    zip = require("gulp-zip");

gulp.task("build", function () {
    return gulp.src("app/**/*")
        .pipe(zip("WebDevelopChecklist.zip"))
        .pipe(gulp.dest("dist"));
});
