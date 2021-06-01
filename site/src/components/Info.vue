<template>
  <v-tooltip top v-if="type == 'tooltip'">
    <template v-slot:activator="{ on, attrs }">
      <span>
        <span v-bind="attrs" v-on="on" v-if="text.length > 0" class="hoverableText">{{
          text
        }}</span>
        <v-icon
          v-if="icon != 'none'"
          :color="iconColor"
          small
          v-bind="attrs"
          v-on="on"
          class="ml-1"
        >
          {{ iconName }}
        </v-icon>
      </span>
    </template>
    <span>{{ content }}</span>
  </v-tooltip>
  <v-dialog v-else v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" v-if="text.length > 0" class="clickableText">{{
        text + " "
      }}</span>
      <v-btn
        class="mx-2"
        x-small
        outlined
        rounded
        :color="iconColor"
        v-bind="attrs"
        v-on="on"
      >
        info

        <!--<v-icon :color="white">
        mdi-information-variant
      </v-icon>-->
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">{{ title }}</v-card-title>

      <v-card-text class="pt-4">
        {{ content }} <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Schließen </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Info",
  props: {
    text: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Info",
    },
    type: {
      type: String, // tooltip, dialog
      default: "tooltip",
    },
    icon: {
      // warn, help, info, study, none
      type: String,
      default: "info",
    },
    outline: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    iconName: function () {
      let baseName = "";
      switch (this.icon) {
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
      if (this.outline) return baseName + "-outline";
      else return baseName;
    },
    iconColor: function () {
      switch (this.icon) {
        case "warn":
          return "red";
        case "help":
          return "primary";
        case "study":
          return "primary";
        default:
          return "primary";
      }
    },
  },
};
</script>
<style scoped>
.hoverableText {
  text-decoration: underline dotted black 1px;
  cursor: help;
}
.clickableText {
  text-decoration: underline dashed black 1px;
}
</style>
