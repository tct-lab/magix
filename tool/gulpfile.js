let gulp = require('gulp');
let fs = require('fs');
let customize = require('./customize');

let type = 'umd,module';
let enableModules = 'rich,mixins,mxevent,richVframe,xml';

gulp.task('combine', () => {
    type.split(',').forEach(t => {
        if (t == 'umd') {
            customize({
                moduleId: 'magix5',
                loaderType: t,
                toJS: true,
                tmplFile: '../src/' + t + '/magix.ts',
                aimFile: '../dist/' + t + '/magix.js',
                enableModules: enableModules
            });
        }
        customize({
            moduleId: 'magix5',
            loaderType: t,
            tmplFile: '../src/' + t + '/magix.ts',
            aimFile: '../dist/' + t + '/magix.ts',
            tmplTSFile: '../src/' + t + '/magix.d.ts',
            aimTSFile: '../dist/' + t + '/magix.d.ts',
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