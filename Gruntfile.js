module.exports = function(grunt) {
    grunt.initConfig({
        //如果需要用到 package.json 中的参数变量，可使用 pkg 引用（如 pkg.name）
        pkg: grunt.file.readJSON('package.json'),
        //监控自动编译
        watch: {
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>' //监听前面声明的端口 28820
                },
                //监听文件列表
                files: [
                    'demo/**',
                    'src/**',
                    'test/**'
                ]
            }
        },
        connect: {
            options: {
                port: 8820,         //webserver 端口
                hostname: '*',      //可配置为本机某个 IP，localhost 或域名
                livereload: 28820,   //声明给 watch 监听的端口
                //protocol: 'https',
                // key: grunt.file.read('server.key').toString(),
                // cert: grunt.file.read('server.crt').toString(),
                // ca: grunt.file.read('ca.crt').toString()
            },
            server: {
                options: {
                    open: true, //自动打开网页 http://localhost:8820
                    base: [     //主目录
                        './'
                    ]
                }
            }
        },
        //eslint 代码质量检查任务
        eslint: {
            options: {},
            src: ['src/bootstrap-suggest.js']
        },
        //concat 多文件合并任务
        concat: {
            js: {
                options: {
                    separator: "\n", //多文件分隔符,
                    stripBanners: true,
                    banner: "/**\r\n * <%= pkg.name %> - v<%= pkg.version %>\r\n" +
                        " * @description <%= pkg.description %>\r\n" +
                        " * @author <%= pkg.author %>\r\n" +
                        " * @GitHub <%= pkg.repository.url %>\r\n" +
                        ' * @since <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\r\n' +
                        " */\r\n"
                },
                src: ['dist/bootstrap-suggest.min.js'], //合并哪些文件
                dest: 'dist/bootstrap-suggest.min.js' //合并后输出
            }
        },
        //uglify 压缩任务，压缩 js
        uglify: {
            js: {
                files: {
                    'dist/bootstrap-suggest.min.js': ['src/bootstrap-suggest.js'] //替换保存
                }
            }
        }
        //cssmin 压缩任务，压缩 css
        /*cssmin: {
            css: {
                src: 'src/index.css',
                dest: 'dist/index.min.css'
            }
        },*/
        //复制到发布目录
        /*copy: {
            main: {
                src: 'dist/bootstrap-suggest.min.js',
                dest: '../../resources/orion/lib/bootstrap-suggest-plugin/bootstrap-suggest.min.js',
            },
        }*/
    });
    //加载包含 eslint、concat 和 uglify 任务的插件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-copy');


    //默认被执行的任务列表
    grunt.registerTask('default', ['serve']);
    //自定义任务列表
    grunt.registerTask('serve', ['connect:server','watch']);
    grunt.registerTask('prod', ['eslint', 'uglify', 'concat']);
};
