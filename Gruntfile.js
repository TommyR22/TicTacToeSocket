module.exports = function(grunt) {

  var buildInfo = {
    projectName: 'tic-tac-toe-socket',
    version: function () {
      var package = grunt.file.readJSON('package.json');
      return package.version;
    },
    pathToRaspberry: '/var/www/html/raspihome',
    pathToDeploy: 'README.md',
    base_href: '/name_directory_server/',
    userAndIPRasp: 'user_name_rasp@ip_rasp'
  };
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    replace: {
      names: {
        src: [
              '.angular-cli.json',
              'src/index.html',
              'package.json'
              ],
        overwrite: true,
        replacements: [{
          from: 'appName',
          to: buildInfo.projectName
        }]
      },
      restoreDefaultName: {
        src: [
          '.angular-cli.json',
          'src/index.html',
          'package.json'
        ],
        overwrite: true,
        replacements: [{
          from: buildInfo.projectName,
          to: 'appName'
        }]
      }
    },
    shell: {
      deployToRaspberry: {
        command: [
          'sudo scp -P 1024 ' + buildInfo.pathToDeploy + ' ' + buildInfo.userAndIPRasp + ':' + buildInfo.pathToRaspberry,
          'echo files copy FROM: ' + buildInfo.pathToDeploy + ' TO: ' + buildInfo.pathToRaspberry
        ].join('&&')
      }
    },
    compress: {
      zip: {
        options: {
          level: 7,
          archive: function () {
            var environment = grunt.config.get('environment');
            if (environment === undefined) {
              grunt.fail.warn('environment not found!');
            }else {
              var vers = grunt.file.readJSON('version.json');
              vers.build[environment] = vers.build[environment] + 1;
              grunt.file.write('version.json', JSON.stringify(vers, null, 2));
              if (environment === 'coll') {
                return buildInfo.zipDir + buildInfo.zipName + '_v' + vers.major + '.' + vers.minor + '.' + vers.maintenance + '_' + (new Array(4).join('0')+ vers.build[environment]).slice(-4) + '_DEV.zip'
              }else {
                return buildInfo.zipDir + buildInfo.zipName + '_v' + vers.major + '.' + vers.minor + '.' + vers.maintenance + '_' + (new Array(4).join('0')+ vers.build[environment]).slice(-4) + '_PROD.zip'
              }            }
          }
        },
        expand: true,
        cwd: 'dist',
        src: ['**/*'],
        dest: '/'
      }
    },
    exec: {
      build_prod: {
        cmd: 'ng build --base-href ' + buildInfo.base_href + ' --env=prod --prod'
      },
      build_dev: {
        cmd: 'ng build'
      },
      ng_serve_dev: {
        cmd: 'ng serve -o'
      },
      ng_serve_prod: {
        cmd: 'ng serve -o --env=prod'
      },
      documentation: {
        cmd: 'ng run compodoc'
      }
    },
    removelogging: {
      remove_in_dist: {
        src: ["dist/main.bundle.js"]
      }
    }
  });

  // salva l'environment scelto per la build (da eseguire SEMPRe prima di una build)
  grunt.registerTask('setConfig', function(environment) {
    if (environment !== ('prod') && environment !== ('dev')) {
      grunt.log.writeln('Environment:', environment);
      grunt.fail.warn('Usage: insert environment! current:', environment);
    }
    grunt.config('environment', environment);
    grunt.log.writeln('Environment: '['blue'] + grunt.config.get('environment')['rainbow'].bold);
  });

  // Load the plugin.
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-remove-logging');

  // task(s).
  // test servers in localhost:4200
  grunt.registerTask('start-dev', ['exec:ng_serve_dev']);
  grunt.registerTask('start-prod', ['exec:ng_serve_prod']);

  // create documentation with compodoc
  grunt.registerTask('createDoc', ['exec:documentation']);
  // replace app name from "appName" tobuildInfo.projectName
  grunt.registerTask('changeName', ['replace:names']);
  // restore app name to "appName"
  grunt.registerTask('restoreName', ['replace:restoreDefaultName']);  // used before changing app's name.
  // building DEV packages and put zip in buildInfo.zipDir
  grunt.registerTask('build-dev', ['setConfig:dev','exec:build_dev']);
  // building PROD packages and put zip in buildInfo.zipDir
  grunt.registerTask('build-prod', ['setConfig:prod', 'exec:build_prod', 'removelogging:remove_in_dist', 'compress:zip']);


};
