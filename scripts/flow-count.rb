#!/usr/bin/env ruby

require "pp"

total = `find js -name '*.js'`.split("\n")
flowd = `ag '@''flow' -l`.split("\n")

puts "Total #{total.count}, flowified #{flowd.count}, #{total.count - flowd.count} to go"
puts total - flowd
