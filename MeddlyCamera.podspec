require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name              = 'MeddlyCamera'
  s.version           = package['version']
  s.summary           = package['description']
  s.license           = package['license']
  s.homepage          = package['homepage']
  s.authors           = 'Eli Richey'
  s.platforms         = { :ios => "11.0" }
  s.source            = { :git => 'github.com:MeddlyApp/visioncamera.git', :tag => "v#{s.version}" }
  s.source_files      = 'apple/**/*.{h,m}'
  s.ios.exclude_files = '**/*.macos.{h,m}'
  s.tvos.exclude_files = '**/*.macos.{h,m}'
  s.osx.exclude_files = '**/*.ios.{h,m}'
  s.requires_arc      = true
  s.dependency          'React-Core'
end