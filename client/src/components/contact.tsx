import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { submitNetlifyForm } from "@/lib/netlify-forms";
import { useLanguage } from "@/lib/i18n";

const createContactSchema = (t: any) => z.object({
  name: z.string().min(1, t("contact.validation.nameRequired")).min(2, t("contact.validation.nameMin")),
  company: z.string().min(1, t("contact.validation.companyRequired")).min(2, t("contact.validation.companyMin")),
  email: z.string().min(1, t("contact.validation.emailRequired")).email(t("contact.validation.emailInvalid")),
  phone: z.string().optional(),
  message: z.string().min(1, t("contact.validation.messageRequired")).min(10, t("contact.validation.messageMin")),
  consent: z.boolean().refine((val) => val === true, t("contact.validation.consentRequired"))
});

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactSchema = createContactSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      consent: false
    }
  });

  const consentValue = watch("consent");

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // En production, la capture passe par Netlify Forms ; en dev local, par
      // l'API Express (utile pour tester sans déployer).
      if (import.meta.env.PROD) {
        await submitNetlifyForm("contact", {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone || "",
          message: data.message,
          consent: data.consent ? "oui" : "non",
        });
        return { success: true };
      }
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      toast({
        title: t("contact.success.toast.title"),
        description: t("contact.success.toast.description"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("contact.error.toast.title"),
        description: error.message || t("contact.error.toast.description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("contact.title").includes("Start") ? (
              <>Start Your <span className="gradient-text">Growth Journey</span></>
            ) : (
              <><span className="gradient-text">{t("contact.title")}</span></>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <motion.div 
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {isSubmitted ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">{t("contact.success.title")}</h3>
              <p className="text-muted-foreground">{t("contact.success.subtitle")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.name")} *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Input
                      id="name"
                      {...register("name")}
                      className="form-field w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                      placeholder={t("contact.placeholder.name")}
                      data-testid="input-name"
                    />
                  </motion.div>
                  {errors.name && (
                    <motion.p 
                      className="mt-1 text-sm text-destructive"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.company")} *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Input
                      id="company"
                      {...register("company")}
                      className="form-field w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                      placeholder={t("contact.placeholder.company")}
                      data-testid="input-company"
                    />
                  </motion.div>
                  {errors.company && (
                    <motion.p 
                      className="mt-1 text-sm text-destructive"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.company.message}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.email")} *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="form-field w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                      placeholder={t("contact.placeholder.email")}
                      data-testid="input-email"
                    />
                  </motion.div>
                  {errors.email && (
                    <motion.p 
                      className="mt-1 text-sm text-destructive"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.form.phone")}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="form-field w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                      placeholder={t("contact.placeholder.phone")}
                      data-testid="input-phone"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.form.message")} *
                </Label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Textarea
                    id="message"
                    rows={6}
                    {...register("message")}
                    className="form-field w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none hover:border-primary/50"
                    placeholder={t("contact.placeholder.message")}
                    data-testid="textarea-message"
                  />
                </motion.div>
                {errors.message && (
                  <motion.p 
                    className="mt-1 text-sm text-destructive"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.message.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Checkbox
                    id="consent"
                    checked={consentValue}
                    onCheckedChange={(checked) => setValue("consent", !!checked)}
                    className="mt-1"
                    data-testid="checkbox-consent"
                  />
                </motion.div>
                <Label htmlFor="consent" className="ml-3 text-sm text-muted-foreground leading-relaxed">
                  {t("contact.form.consent")} *
                </Label>
              </motion.div>
              {errors.consent && (
                <motion.p 
                  className="text-sm text-destructive"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.consent.message}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all glow-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    data-testid="button-submit"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, repeat: contactMutation.isPending ? Infinity : 0 }}
                    />
                    <span className="relative z-10">
                      {contactMutation.isPending ? t("contact.form.sending") : t("contact.form.submit")}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
