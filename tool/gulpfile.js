let gulp = require('gulp');
let fs = require('fs');
let customize = require('./customize');
let doc = require('./lib/doc');

let ts = require('typescript');

let type = 'umd,module';
//let enableModules = 'mxevent,richVframe,xml,async,service,state,wait,load,lang,spreadMxViewParams';
let enableModules = 'mxevent,richVframe,xml,async,service,wait,lang,router,routerHash,routerTip,richView,innerView,recast,require,xview,taskComplete,taskIdle,spreadMxViewParams,removeStyle,taskCancel,eventVframe,richVframeInvokeCancel,waitSelector,remold,rewrite,rebuild,load,state,batchDOMEvent,richVframeDescendants,preloadViews,esmoduleCheck';
//let enableModules = 'xml,async';
//let enableModules = 'mxevent,richVframe,xml,async';

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

gulp.task('patch', () => {
    let json = fs.readFileSync('./revisement.json').toString();
    let revisableReg = /@\{[a-zA-Z\.0-9\-\~#]+\}/g;
    let source = fs.readFileSync('../src/umd/patch.ts').toString();
    let result = ts.transpileModule(source, {
        compilerOptions: {
            target: 'es6',
            module: ts.ModuleKind.None
        }
    });
    let content = result.outputText;
    let rJSON = JSON.parse(json);
    content = content.replace(revisableReg, m => {
        return rJSON[m] || m;
    });
    fs.writeFileSync('../dist/umd/patch.js', content);
});

gulp.task('default', gulp.parallel('combine', 'patch', () => {
    console.log('done');
}));

gulp.task('doc', () => {
    let content = fs.readFileSync('../dist/umd/magix.js').toString();
    console.log(doc(content));
})