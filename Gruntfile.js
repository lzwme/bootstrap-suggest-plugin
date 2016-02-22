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
		//eslint 代码质量检查任务
		eslint: {
			options: {
			},
			src: ['bootstrap-suggest.js']
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
		}
		//cssmin 压缩任务，压缩 css
		/*cssmin: {
			css: {
				src: 'index.min.css',
				dest: 'index.min.css'
			}
		},*/
		//复制到发布目录
		/*copy: {
			main: {
				src: 'bootstrap-suggest.min.js',
				dest: '../../resources/orion/js/common/bootstrap-suggest.min.js',
			},
		}*/
	});
	//加载包含 eslint、concat 和 uglify 任务的插件
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("gruntify-eslint");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');


	//默认被执行的任务列表
	grunt.registerTask('default', ['eslint', 'uglify', 'concat']);
	//自定义任务列表
	grunt.registerTask('development', ['eslint', 'uglify', 'concat'/*, 'copy'*/]);
	grunt.registerTask('production', ['eslint', 'uglify', 'concat']);
};