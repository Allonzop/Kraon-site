import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg mr-3" />
            <span className="text-xl font-bold text-foreground">KRAON</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-muted-foreground mb-2">Premium Digital Marketing for Ambitious SMEs</p>
            <p className="text-sm text-muted-foreground">© 2024 KRAON. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
