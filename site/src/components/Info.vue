<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" v-if="text.length > 0" class="hoverableText">{{ text + " " }}</span>
      <v-icon v-if="icon != 'none'" :color="iconColor" small v-bind="attrs" v-on="on">
        {{ iconName }}
      </v-icon>
    </template>
    <span>{{ content }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'Info',
    props: {
      "text": {
        type: String,
        default: ""
      },
      "content": {
        type: String,
        required: true
      },
      "type": {
        type: String, // tooltip, dialog
        default: "tooltip"
      },
      "icon": { // warn, help, info, study, none
        type: String,
        default: "info"
      },
      "outline": { 
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      
    }),
    computed: {
      iconName: function () {
        let baseName = "";
        switch(this.icon) {
          case "warn":
            baseName = "mdi-alert-circle";
            break;
          case "help":
            baseName = "mdi-help-circle";
            break;
          case "study":
            baseName = "mdi-school";
            break;
          default:
            baseName = "mdi-information";
            break;
         }
         if (this.outline)
            return baseName + "-outline";
        else  
          return baseName;
      },
      iconColor: function() {
        switch(this.icon) {
          case "warn":
            return "red";
          case "help":
            return "primary";
          case "study":
            return "primary";
          default:
             return "primary";
         }
      }
    }
  }
 
</script>
<style scoped>
.hoverableText {
  text-decoration: underline dotted black 1px;
}
</style>