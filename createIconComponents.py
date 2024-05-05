import os
import re

def remove_tag(regex, text):
  matches = re.findall(regex, text)
  for match in matches:
    text = text.replace(match, '')
  return text

icon_folder = os.path.join(os.path.dirname(__file__), 'src', 'icons')
component_folder = os.path.join(os.path.dirname(__file__), 'src', 'components', 'icons')
for file in os.listdir(icon_folder):
  if file.endswith('.svg'):
    print(f'Checking {file}')
    with open(os.path.join(icon_folder, file), mode='r') as f:
      content = f.readlines()

    data = ''.join([x.strip() for x in content])
    r = re.search(r'(<svg.*</svg>)', data)
    svg_content = r.groups()[0]

    svg_content = remove_tag(r'(<!--.*-->)', svg_content)
    svg_content = remove_tag(r'(<title.*</title>)', svg_content)
    svg_content = remove_tag(r'(<desc.*</desc>)', svg_content)
    svg_content = remove_tag(r'(<style.*</style>)', svg_content)
    # svg_content = remove_tag(f'(fill=".*?")', svg_content)

    file_content = f'<template>{svg_content}</template>'

    _ = file.split('-')
    icon_name = ''.join([x.capitalize() for x in _])
    new_name = f'Icon{icon_name.replace('.svg', '')}.vue'
    dest_file = os.path.join(component_folder, new_name)

    with open(dest_file, mode='w+') as f:
      f.write(file_content)
