module.exports = function(grunt) {
	grunt.initConfig({
		//如果需要用到 package.json 中的参数变量，可使用 pkg 引用（如 pkg.name）
		pkg : grunt.file.readJSON('package.json'),
		//监控自动编译
		watch: {
		  options: {
			atBegin: true
		  },
		  js: {
			files: 'bootstrap-suggest.js',
			tasks: ['development']
		  }
		},
		//JSHint 代码质量检查任务
		jshint: {
			options: {
				//大括号包裹
				curly: true,
				//对于简单类型，使用===和!==，而不是==和!=
				eqeqeq: true,
				//对于首字母大写的函数（声明的类），强制使用new
				newcap: true,
				//禁用arguments.caller和arguments.callee
				noarg: true,
				//对于属性使用aaa.bbb而不是aaa['bbb']
				sub: false,
				//查找所有未定义变量
				//undef: true,
				//查找类似与if(a = 0)这样的代码
				boss: true,
				//指定运行环境为node.js
				node: false
			},
			//具体任务配置
			files: {
				src: ['bootstrap-suggest.js']
			}
			//all: ['www/js/index.js']
		},
		//concat 多文件合并任务 
		concat: {
			js: {
				//banner: "'use strict';\n",
				options: {
					separator: "\n", //多文件分隔符,
					stripBanners: true,
					banner: "/*\r\n<%= pkg.name %> - v<%= pkg.version %>\r\n" +
						"Description: <%= pkg.description %>\r\n" +
						"Author: <%= pkg.author %>\r\n" +
						"Github: https://github.com/lzwme/bootstrap-suggest-plugin\r\n" +
						'Update: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\r\n' +
						"*/\r\n"
				},
				src: ['bootstrap-suggest.min.js'], //合并哪些文件
				dest: 'bootstrap-suggest.min.js' //合并后输出 
			}
		},
		//uglify 压缩任务，压缩 js
		uglify: {
			js: {
				files: {
					'bootstrap-suggest.min.js': ['bootstrap-suggest.js'] //替换保存
				}
			}
		},
		//cssmin 压缩任务，压缩 css
		/*cssmin: {
			css: {
				src: 'index.min.css',
				dest: 'index.min.css'
			}
		},*/
		//复制到发布目录
		copy: {
			main: {
				src: 'bootstrap-suggest.min.js',
				dest: '../../resources/orion/js/common/bootstrap-suggest.min.js',
			},
		}
	});
	//加载包含 jshint、concat 和 uglify 任务的插件
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	
	//默认被执行的任务列表
	grunt.registerTask('default', ['jshint', 'uglify', 'concat']);
	//自定义任务列表
	grunt.registerTask('development', ['jshint', 'uglify', 'concat'/*, 'copy'*/]);
	grunt.registerTask('production', [ 'uglify', 'concat']);
};