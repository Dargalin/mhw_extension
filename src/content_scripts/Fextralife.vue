<template> </template>
<script>
export default {
  name: 'fextralife',
  props: {
    monster: {
      type: Array,
      default: () => {
        return [];
      },
    },
    material: {
      type: Array,
      default: () => {
        return [];
      },
    },
    location: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      paragraphs: null,
      map: {},
    };
  },
  mounted() {
    this.getStrings();
    this.createMapObj();
    this.replaceStrings();
  },
  methods: {
    getStrings() {
      this.paragraphs = document.querySelectorAll('td');
    },
    createMapObj() {
      this.material.forEach(mat => {
        let output = '';
        if (mat.source && mat.source.monster) {
          output = mat.name + '</a>';
          Object.keys(mat.source.monster).forEach(id => {
            const mon = this.monster.find(x => x.id == id);
            if (mon) {
              output += ' <span class="mhw_ext"><img src="' + browser.runtime.getURL('images/' + mon.icon) + '">';
              output += '<span class="mhw_loc"><span>Monster: <a href="' + mon.url + '">' + mon.name + '</a> ';
              // add Stars
              if (mat.source.monster[id].rate) {
                output += '⭐'.repeat(3);
              }
              output += '</span>';
              Object.keys(mat.source.monster[id].location).forEach(index => {
                const loc = this.location[index];
                if (loc) {
                  output +=
                    '<span><img src="' + browser.runtime.getURL('images/' + loc.icon) + '" />' + loc.name + ' (' + mat.source.monster[id].location[index].level + ')</span>';
                }
              });
              output += '</span>';
              output += '</span>';
            }
          });
        }
        this.map[mat.name + '</a>'] = output;
      });
    },
    replaceStrings() {
      for (let paragraph of this.paragraphs) {
        var rex = new RegExp(Object.keys(this.map).join('|'), 'gi');

        paragraph.innerHTML = paragraph.innerHTML.replace(rex, matched => {
          return this.map[matched];
        });
      }
    },
  },
};
</script>
<style lang="scss">
.mhw_ext {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  border: 0.5px solid transparent;
  width: 28px;
  transition: 0.2s all;
  z-index: 1;
  &:hover {
    border: 0.5px solid #444;
    border-radius: 2px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #222;
    transform: scale(2);
    z-index: 3;
    box-shadow: 0 0 0.3em black;

    & .mhw_loc {
      display: inline-block;
      z-index: 2;
    }
  }
  & img {
    width: 24px;
    height: 24px;
    margin: 1px;
  }
}
.mhw_loc {
  position: absolute;
  display: none;
  border: 0.5px solid #444;
  border-radius: 2px;
  background-color: #222;
  font-size: 0.5em;
  padding: 0 1em;
  white-space: nowrap;
  box-shadow: 0 0 0.3em black;

  line-height: 0.4em;

  left: -4px;
  top: 24px;

  & img {
    width: 12px;
    height: 12px;
    margin: 0;
  }
  & span {
    display: block;
    padding-right: 16px;

    &:first-child {
      line-height: 2em;
    }
  }
}
</style>
