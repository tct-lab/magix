let gulp = require('gulp');
let terser = require('gulp-terser-scoped');
let fs = require('fs');
let rename = require('gulp-rename');
let header = require('gulp-header');
let pkg = require('../package.json');
let customize = require('./customize');

let type = 'cmd,module'; //打包kissy则type='kissy'
let enableModules = 'service';

gulp.task('combine', () => {
    type.split(',').forEach(t => {
        customize({
            moduleId: 'magix5',
            loaderType: t,
            tmplFile: '../src/' + t + '/magix.js',
            aimFile: '../dist/' + t + '/magix-debug.js',
            enableModules: enableModules
        }, map => {
            let m = {};
            for (let p in map) {
                for (let u in map[p]) {
                    m[u] = map[p][u];
                }
            }
            fs.writeFileSync('./revisement.json', JSON.stringify(m, null, 4));
        });
    });
});

gulp.task('compress', () => {
    type.split(',').forEach(t => {
        gulp.src('../dist/' + t + '/magix-debug.js')
            .pipe(terser({
                esModule: t == 'module',
                compress: {
                    expression: true,
                    keep_fargs: false,
                    drop_console: true,
                    global_defs: {
                        DEBUG: false
                    }
                },
                output: {
                    ascii_only: true
                }
            }))
            .pipe(header('/*!<%=ver%> MIT kooboy_li@163.com*/', {
                ver: pkg.version
            }))
            .pipe(rename('magix.js'))
            .pipe(gulp.dest('../dist/' + t + '/'));
    });
});