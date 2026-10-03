import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

import GameIcon from './components/GameIcon.vue'
import Shots from './components/Shots.vue'
import Recipe from './components/Recipe.vue'
import RecipeRest from './components/RecipeRest.vue'
import Keizon from './components/Keizon.vue'
import KeizonRest from './components/KeizonRest.vue'


import SkillTree from './components/SkillTree.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GameIcon', GameIcon)
    app.component('Shots', Shots)
    app.component('Recipe', Recipe)
    app.component('RecipeRest', RecipeRest)
    app.component('Keizon', Keizon)
    app.component('KeizonRest', KeizonRest)
    app.component('SkillTree', SkillTree)
  }
} satisfies Theme
