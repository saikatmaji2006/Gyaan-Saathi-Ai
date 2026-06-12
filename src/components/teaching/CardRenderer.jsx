import { motion } from 'framer-motion'
import ConceptCard from './ConceptCard'
import DefinitionCard from './DefinitionCard'
import ExampleCard from './ExampleCard'
import FormulaCard from './FormulaCard'
import PracticeCard from './PracticeCard'
import HintCard from './HintCard'
import SummaryCard from './SummaryCard'
import RealWorldCard from './RealWorldCard'
import VisualCard from './VisualCard'

const cardComponents = {
  concept: ConceptCard,
  definition: DefinitionCard,
  example: ExampleCard,
  formula: FormulaCard,
  practice: PracticeCard,
  hint: HintCard,
  summary: SummaryCard,
  real_world: RealWorldCard,
  visual: VisualCard,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function CardRenderer({ sections = [], activeIndex = -1, showAll = false }) {
  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sections.map((section, i) => {
        if (!showAll && activeIndex >= 0 && i > activeIndex) return null
        const Component = cardComponents[section.type]
        if (!Component) return null

        return (
          <motion.div key={i} variants={cardVariants}>
            <Component data={section} index={i} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
