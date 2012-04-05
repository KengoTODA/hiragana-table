require 'net/https'
require 'uri'
require 'rake/packagetask'
require 'rake/clean'

task :default => 'create_all'
PACKAGE_NAME = 'MyGame'
PACKAGE_VERSION = '1.0.0'
OPTIMIZE_DIR = './optimize'

CLEAN.include(FileList[OPTIMIZE_DIR])

plugins = ["nineleap.enchant.js"]
plugin_dependencies = {
  'ui.enchant.js' => ['wise9/enchant.js/master/images/pad.png', 'wise9/enchant.js/master/images/apad.png'],
  'nineleap.enchant.js' => ['wise9/enchant.js/master/images/start.png','wise9/enchant.js/master/images/end.png']
}

def download(path)
  uri = URI.parse('https://raw.github.com/' + path)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  request = Net::HTTP::Get.new(uri.request_uri)
  http.request(request).body
end

multitask :create_all => ['index.html', 'game.js', 'enchant.js', 'require.js', 'order.js'] + plugins do |t|
  puts 'all files have been created'
end

file 'index.html' do |t|
  File.open(t.name, 'w') {|f|
    f << download('eller86/press-start/master/template/index.html')
  }
end

file 'game.js' do |t|
  File.open(t.name, 'w') {|f|
    f << download('eller86/press-start/master/template/game.js').sub(']', plugins.map{|filename| ",'order!" + File.basename(filename, '.js') + "'"}.join() + ']')
  }
end

file 'enchant.js' do |t|
  File.open(t.name, 'w') {|f|
    f << download("wise9/enchant.js/master/enchant.js")
  }
end

file 'require.js' do |t|
  File.open(t.name, 'w') {|f|
    f << download("jrburke/requirejs/master/require.js")
  }
end

file 'order.js' do |t|
  File.open(t.name, 'w') {|f|
    f << download("jrburke/requirejs/master/order.js")
  }
end

file "build_profile.js" do |t|
  File.open(t.name, 'w') {|f|
    f << download('eller86/press-start/master/template/build_profile.js')
  }
end

desc 'rule for official plugins'
rule '.enchant.js' do |t|
  File.open(t.name, 'w') {|f|
    f << download('wise9/enchant.js/master/plugins/' + t.name);
    plugin_dependencies[t.name].each{|resource|
      file_name = File.basename(resource)
      File.open(file_name, 'w') {|r|
        r << download(resource);
      }
    } if !plugin_dependencies[t.name].nil?
  }
end

directory OPTIMIZE_DIR
task 'optimize' => [OPTIMIZE_DIR, 'build_profile.js'] do
  sh 'r.js -o build_profile.js'
end

# please execute this task in './optimize' directory if you want to package optimized-version
Rake::PackageTask.new(PACKAGE_NAME, PACKAGE_VERSION) do |p|
  p.package_dir = './pkg'
  p.package_files.include('./**/*')
  p.need_zip = true
end