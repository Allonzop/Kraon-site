import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

// Projects data will be generated using translations

export default function Work() {
  const { t } = useLanguage();

  const projects = [
    {
      id: 1,
      title: t("work.project1.title"),
      category: t("work.project1.category"),
      result: t("work.project1.result"),
      gradient: "from-primary/20 to-accent/20"
    },
    {
      id: 2,
      title: t("work.project2.title"),
      category: t("work.project2.category"),
      result: t("work.project2.result"),
      gradient: "from-accent/20 to-primary/20"
    },
    {
      id: 3,
      title: t("work.project3.title"),
      category: t("work.project3.category"),
      result: t("work.project3.result"),
      gradient: "from-primary/20 to-secondary/20"
    },
    {
      id: 4,
      title: t("work.project4.title"),
      category: t("work.project4.category"),
      result: t("work.project4.result"),
      gradient: "from-accent/20 to-secondary/20"
    }
  ];

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
            {t("work.title").includes("Featured") ? (
              <>Featured <span className="gradient-text">Work</span></>
            ) : (
              <><span className="gradient-text">{t("work.title")}</span></>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("work.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card relative glass rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                rotateY: -2,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              data-testid={`project-${project.id}`}
            >
              <motion.div 
                className={`aspect-video bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Animated background pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '20px 20px'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="absolute inset-0 bg-secondary/40" />
                
                {/* Floating elements inside project card */}
                <motion.div
                  className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
                
                <motion.div 
                  className="absolute bottom-4 left-4 z-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <motion.span 
                    className="text-sm text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.95)" }}
                  >
                    {project.category}
                  </motion.span>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="project-overlay absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.div 
                  className="text-center px-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.h3 
                    className="text-2xl font-bold mb-3 text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p 
                    className="text-lg mb-6 text-white/90"
                    whileHover={{ x: 2 }}
                  >
                    {project.result}
                  </motion.p>
                  <motion.button 
                    className="bg-primary/90 backdrop-blur-sm border border-primary text-white px-6 py-3 rounded-lg font-medium transition-all relative overflow-hidden group"
                    data-testid={`button-view-details-${project.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">{t("work.viewDetails")}</span>
                  </motion.button>
                </motion.div>
              </motion.div>
              
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
