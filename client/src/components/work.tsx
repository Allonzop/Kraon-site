import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "TechFlow Solutions",
    category: "E-commerce",
    result: "350% ROAS increase in 6 months",
    gradient: "from-primary/20 to-accent/20"
  },
  {
    id: 2,
    title: "DataViz Pro",
    category: "SaaS",
    result: "5x lead generation growth",
    gradient: "from-accent/20 to-primary/20"
  },
  {
    id: 3,
    title: "MedTech Innovations",
    category: "Healthcare",
    result: "200% organic traffic increase",
    gradient: "from-primary/20 to-secondary/20"
  },
  {
    id: 4,
    title: "CryptoWave Exchange",
    category: "Fintech",
    result: "10x conversion rate optimization",
    gradient: "from-accent/20 to-secondary/20"
  }
];

export default function Work() {
  return (
    <section id="work" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Case studies of transformative digital campaigns for ambitious brands
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card relative glass rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              data-testid={`project-${project.id}`}
            >
              <div className={`aspect-video bg-gradient-to-br ${project.gradient} relative`}>
                <div className="absolute inset-0 bg-secondary/50" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <motion.div 
                className="project-overlay absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-lg mb-4">{project.result}</p>
                  <button 
                    className="bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
                    data-testid={`button-view-details-${project.id}`}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
