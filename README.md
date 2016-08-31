# markdown-it-block-embed [![Build Status](https://travis-ci.org/rotorz/markdown-it-block-embed.svg?branch=master)](https://travis-ci.org/rotorz/markdown-it-block-embed)

[![npm version](https://badge.fury.io/js/markdown-it-block-embed.svg)](https://badge.fury.io/js/markdown-it-block-embed)
[![Dependency Status](https://david-dm.org/rotorz/markdown-it-block-embed.svg)](https://david-dm.org/rotorz/markdown-it-block-embed)
[![devDependency Status](https://david-dm.org/rotorz/markdown-it-block-embed/dev-status.svg)](https://david-dm.org/rotorz/markdown-it-block-embed#info=devDependencies)

Plugin for markdown-it that detects and outputs block level embeds such as videos and supports custom embed services.

This project started as a fork of the [markdown-it-video](https://github.com/brianjgeiger/markdown-it-video)
package but for the most part has been rewritten to behave as a block element rather than
an inline one. Implementation of embed services were separated and additional options have
been added to control the output of the generated embed code.


Example input:
```markdown
Here is an embedded video:

@[youtube](lJIrF4YjHfQ)
```

Output (with default options):
```html
<div class="block-embed block-embed-service-youtube">
  <iframe type="text/html"
          width="640"
          height="390"
          src="//www.youtube.com/embed/lJIrF4YjHfQ"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```


## Install

```
$ npm install --save markdown-it-block-embed
```


## Usage

```javascript
var md = require("markdown-it")();
var blockEmbedPlugin = require("markdown-it-block-embed");

md.use(blockEmbedPlugin, {
  containerClassName: "video-embed"
});

var input = "@[youtube](lJIrF4YjHfQ)";
var output = md.render(input);

console.log(output);
```


## Options

Option               | Type                 | Default                  | Description
:--------------------|:---------------------|:-------------------------|:------------------------------------------------------------------------------------------------------------------------------------------
`containerClassName` | `string` \| `null`   | `'block-embed'`          | Class name for image container element.
`serviceClassPrefix` | `string`             | `'block-embed-service-'` | Prefix for service name in CSS class.
`outputPlayerSize`   | `boolean`            | `true`                   | Indicates if 'width' and 'height' attributes are written to output.
`allowInstancePlayerSizeDefinition` | `boolean` | `false`              | Indicates whether individual player instances found within content may override the default size. Used by e.g.: `@[youtube](lJIrF4YjHfQ##400x300)`
`allowFullScreen`    | `boolean`            | `true`                   | Indicates whether embed iframe should be allowed to enter full screen mode.
`filterUrl`          | `function` \| `null` | `null`                   | A function that customizes url output. Signature: `function (url: string, serviceName: string, videoID: string, options: object): string`
                     |                      |                          |
`services.{name}`    | `function`           | -                        | A function that constructs a new instance of the service. Can extend `VideoServiceBase`.
`services.youtube`   | `function`           | `YouTubeService`         | Implementation of the 'youtube' embed service. Can be overridden by a custom implementation.
`services.vimeo`     | `function`           | `VimeoService`           | Implementation of the 'vimeo' embed service. Can be overridden by a custom implementation.
`services.vine`      | `function`           | `VineService`            | Implementation of the 'vine' embed service. Can be overridden by a custom implementation.
`services.prezi`     | `function`           | `PreziService`           | Implementation of the 'prezi' embed service. Can be overridden by a custom implementation.
                     |                      |                          |
`{service-name}`     | `object`             | -                        | Options can be supplied to embed services. 
                     |                      |                          |
`youtube.width`      | `number`             | `640`                    | Width of YouTube embed.
`youtube.height`     | `number`             | `390`                    | Height of YouTube embed.
                     |                      |                          |
`vimeo.width`        | `number`             | `500`                    | Width of Vimeo embed.
`vimeo.height`       | `number`             | `281`                    | Height of Vimeo embed.
                     |                      |                          |
`vine.width`         | `number`             | `600`                    | Width of Vine embed.
`vine.height`        | `number`             | `600`                    | Height of Vine embed.
`vine.embed`         | `string`             | `'simple'`               | Type of embed; for instance, `'simple'` or `'postcard'` (see https://dev.twitter.com/web/vine).
                     |                      |                          |
`prezi.width`        | `number`             | `550`                    | Width of Prezi embed.
`prezi.height`       | `number`             | `400`                    | Height of Prezi embed.


## Supported Services

HTML embed codes are currently automatically output for the following services:

- YouTube
- Vimeo
- Vine
- Prezi

Custom embed services can be specifying in the options that you provide to the
`markdown-it-block-embed` plugin.   


### YouTube

```md
@[youtube](lJIrF4YjHfQ)
```

is interpreted as

```html
<div class="block-embed block-embed-service-youtube">
  <iframe type="text/html"
          width="640"
          height="390"
          src="//www.youtube.com/embed/lJIrF4YjHfQ"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```

Alternately, you could use a number of different YouTube URL formats rather than just the video id.

```md
@[youtube](http://www.youtube.com/embed/lJIrF4YjHfQ)
@[youtube](https://www.youtube.com/watch?v=lJIrF4YjHfQ&feature=feedrec_centerforopenscience_index)
@[youtube](http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o)
@[youtube](http://www.youtube.com/v/lJIrF4YjHfQ?fs=1&amp;hl=en_US&amp;rel=0)
@[youtube](http://www.youtube.com/watch?v=lJIrF4YjHfQ#t=0m10s)
@[youtube](http://www.youtube.com/embed/lJIrF4YjHfQ?rel=0)
@[youtube](http://www.youtube.com/watch?v=lJIrF4YjHfQ)
@[youtube](http://youtu.be/lJIrF4YjHfQ)
```

### Vimeo

```md
@[vimeo](19706846)
```

is interpreted as

```html
<div class="block-embed block-embed-service-vimeo">
  <iframe type="text/html"
          width="500"
          height="281"
          src="//player.vimeo.com/video/19706846"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```

Alternately, you could use the url instead of just the video id.

```md
@[vimeo](https://vimeo.com/19706846)
@[vimeo](https://player.vimeo.com/video/19706846)
```

### Vine

```md
@[vine](bjHh0zHdgZT)
```

is interpreted as

```html
<div class="block-embed block-embed-service-vine">
  <iframe type="text/html"
          width="600"
          height="600"
          src="//vine.co/v/bjHh0zHdgZT/embed/simple"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```

Alternately, you could use the url, or even the whole embed tag instead of just the video id.

```md
@[vine](https://vine.co/v/bjHh0zHdgZT/embed/simple)
@[vine](https://vine.co/v/bjHh0zHdgZT/embed/postcard?audio=1)
@[vine](<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple?audio=1" width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>)
```

### Prezi

```md
@[prezi](1kkxdtlp4241)
```

is interpreted as 

```html
<div class="block-embed block-embed-service-prezi">
  <iframe type="text/html"
          width="550"
          height="400"
          src="https://prezi.com/embed/1kkxdtlp4241/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```

Alternately, you could use the url.

```md
@[prezi](https://prezi.com/1kkxdtlp4241/valentines-day/)
@[prezi](https://prezi.com/e3g83t83nw03/destination-prezi-template/)
@[prezi](https://prezi.com/prg6t46qgzik/anatomy-of-a-social-powered-customer-service-win/)
```


## Contribution Agreement

This project is licensed under the MIT license (see LICENSE). To be in the best
position to enforce these licenses the copyright status of this project needs to
be as simple as possible. To achieve this the following terms and conditions
must be met:

- All contributed content (including but not limited to source code, text,
  image, videos, bug reports, suggestions, ideas, etc.) must be the
  contributors own work.

- The contributor disclaims all copyright and accepts that their contributed
  content will be released to the public domain.

- The act of submitting a contribution indicates that the contributor agrees
  with this agreement. This includes (but is not limited to) pull requests, issues,
  tickets, e-mails, newsgroups, blogs, forums, etc.
