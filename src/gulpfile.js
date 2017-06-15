/// <binding BeforeBuild='build' Clean='clean' />

var gulp = require("gulp"),
    rename = require("gulp-rename"),
    shell = require("gulp-shell"),
    zip = require("gulp-zip"),
    rimraf = require("rimraf");

var manifest = JSON.parse(require("fs").readFileSync('./app/manifest.json'));

gulp.task("build", ["edge"]);
gulp.task("package", ["webextension:package", "edge:package"]);

gulp.task("clean", function (cb) {
    rimraf("temp", cb);
});


// Package
gulp.task("webextension:package", function (cb) {
    return gulp.src("app/**/*")
        .pipe(zip(manifest.name + "-" + manifest.version + ".zip"))
        .pipe(gulp.dest("dist"));
});

gulp.task("edge:package", shell.task([
    "manifoldjs -l debug -p edgeextension package temp\\edgeextension\\manifest\\"
]));

gulp.task("edge:copyappx", function (cb) {
    return gulp.src("temp/edgeextension/package/*.appx", { base: "temp/edgeextension/package" })
        .pipe(rename(manifest.name + "-" + manifest.version + ".appx"))
        .pipe(gulp.dest("dist"));
});

//Edge
gulp.task("edge", ["edge:copyfiles", "edge:copytodist"]);

gulp.task("edge:copyfiles", function (cb) {
    return gulp.src("edge/**/*")
        .pipe(gulp.dest("temp/edgeextension"));
});

gulp.task("edge:copytodist", function (cb) {
    return gulp.src("app/**/*")
        .pipe(gulp.dest("temp/edgeextension/manifest/Extension"));
});
