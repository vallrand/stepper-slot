module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.initConfig({
        clean: { all: ['dist/'] },
        base64: {
            assets: {
                src: ['assets/**.*'],
                dest: 'src/assets.json'
            }
        },
        browserify: {
            development: {
                src: ['src/index.ts'],
                dest: 'dist/index.js',
                options: {
                    plugin: ['tsify']
                }
            }
        },
        watch: {
            options: {
                nospawn: false
            },
            files: ['src/**/*'],
            tasks: ['browserify:development']
        }
    })
    grunt.registerTask('build', ['clean:all', 'base64:assets', 'browserify:development'])
    grunt.registerTask('default', ['build', 'watch'])

    grunt.registerMultiTask('base64', 'Base64 encode files.', function(){
        const options = this.options({})
        this.files.forEach(function(file){
            const bundle = {}
            for(let filepath of file.src)
                bundle[filepath] = `data:image/png;base64,${grunt.file.read(filepath, { encoding: 'base64' })}`
            grunt.file.write(file.dest, JSON.stringify(bundle, null, 0))
            grunt.log.writeln(`Base64 encoded "${file.dest}".`)
        })
    })
}