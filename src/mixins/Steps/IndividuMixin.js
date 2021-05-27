import Individu from "@/lib/Individu"

export const createIndividuMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individu } = Individu.get(
        this.$store.getters.peopleParentsFirst,
        role,
        this.$route.params.id,
        this.$store.state.dates
      )
      const value = individu[fieldName]
      return {
        error: false,
        fieldName,
        individu,
        id,
        value,
        role,
        optional,
      }
    },
    methods: {
      getLabel: function (type) {
        return Individu.label(this.individu, type)
      },
      onSubmit: function () {
        if (this.requiredValueMissing()) {
          return
        }
        this.individu[fieldName] = this.value
        this.$store.dispatch("updateIndividu", this.individu)
      },
    },
  }
}
