/* -*- mode: javascript; tab-width: 4; insert-tabs-mode: nil; indent-tabs-mode: nil -*- */

function cast(tags, dictionary) {
  var objects = [];
  var pframe = { };
  var i = 0;
  var tag;
  while (tag = tags[i++]) {
    if (tag.id) {
      switch (tag.type) {
      case 'font':
        var obj = defineFont(tag, dictionary);
        break;
      case 'shape':
        var obj = defineShape(tag, dictionary);
        break;
      case 'sprite':
        var obj = {
          type: 'clip',
          id: tag.id,
          pframes: cast(tag.tags)
        };
        break;
      case 'text':
        var obj = defineText(tag, dictionary);
        break;
      }
      dictionary[obj.id] = obj;
      objects.push(obj);
      continue;
    }
    switch (tag.type) {
    case 'frame':
      for (var n = 0; (tag = tags[i]) && tag.type === 'frame'; ++n, ++i);
      if (n > 1)
        pframe.repeat = n;
      pframe.type = 'pframe';
      objects.push(pframe);
      pframe = { };
      break;
    case 'place':
      var entry = { move: tag.move };
      if (tag.place)
        entry.id = tag.objId;
      if (tag.hasMatrix)
        entry.matrix = tag.matrix;
      if (tag.hasRatio)
        entry.ratio = tag.ratio / 0xffff;
      pframe[tag.depth] = entry;
      break;
    case 'remove':
      pframe[tag.depth] = null;
      break;
    }
  }
  return objects;
};