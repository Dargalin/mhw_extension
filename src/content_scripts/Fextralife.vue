<template></template>
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
              // add tempered background
              output += ` <span class="mhw_ext"><span class="mhw_img ${mat.source.monster[id].tempered ? 'tempered' : ''}"><img src="${browser.runtime.getURL(
                'images/' + mon.icon
              )}"></span>`;
              // add name
              output += `<span class="mhw_info"><span class="mhw_monster"><a href="${mon.url}">${mat.source.monster[id].tempered ? 'Tempered' : ''} ${mon.name}</a> `;
              // add Stars
              if (mat.source.monster[id].rate) {
                output += '⭐'.repeat(3);
              }
              output += '</span>';
              Object.keys(mat.source.monster[id].location).forEach(index => {
                const loc = this.location[index];
                if (loc) {
                  output += `<span class="mhw_location"><img style="max-width: unset !important;" src="${browser.runtime.getURL('images/' + loc.icon)}" />${loc.name} (${
                    mat.source.monster[id].location[index].level
                  })</span>`;
                }
              });
              output += '</span></span></span>';
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
  width: 24px;
  z-index: 1;

  & .mhw_img {
    transition: 0.2s all;
    border: 1px solid transparent;
    &.tempered {
      background: #470769;
      box-shadow: 0 0 0.3em #470769;
    }
  }
  &:hover {
    z-index: 3;

    & .mhw_img {
      transform: scale(2);
      border: 1px solid #444;
      border-radius: 2px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background-color: #222;
      box-shadow: 0 0 0.3em black;

      &.tempered {
        background: #470769;
      }
    }

    & .mhw_info {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
      z-index: 2;
    }
  }
  & img {
    width: 20px;
    height: 20px;
    margin: 1px;
  }

  .mhw_info {
    transition: 0.15s all;
    transform: translateY(-12px);
    position: absolute;
    pointer-events: none;
    opacity: 0;
    border: 2px solid #444;
    border-radius: 4px;
    background-color: #222;
    font-size: 1em;
    padding: 0;
    box-shadow: 0 0 0.3em black;
    display: flex;
    flex-direction: column;

    left: -16px;
    top: 36px;

    & img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }

    & span {
      display: inline-block;
      padding: 0.1em 0.3em;
    }

    & .mhw_description {
      font-style: italic;
      border-bottom: 1px dotted #444;
      padding: 0.2em 1em;

      & span {
        width: 20em;
        &:before {
          content: '»';
        }
        &:after {
          content: '«';
        }
      }
    }

    & .mhw_monster {
      border-bottom: 1px dotted #444;
    }

    & .mhw_location {
      white-space: nowrap;
    }
  }
}
</style>
