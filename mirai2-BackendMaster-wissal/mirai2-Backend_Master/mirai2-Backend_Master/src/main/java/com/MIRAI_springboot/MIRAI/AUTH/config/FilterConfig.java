package com.MIRAI_springboot.MIRAI.AUTH.config;


import com.MIRAI_springboot.MIRAI.AUTH.util.JwtAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilter() {
        FilterRegistrationBean<JwtAuthenticationFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new JwtAuthenticationFilter());
        //intern routes
        registrationBean.addUrlPatterns("/certifications/*"); // Apply filter only to secured APIs
        registrationBean.addUrlPatterns("/internship/*");
        registrationBean.addUrlPatterns("/rapports/*");
        registrationBean.addUrlPatterns("/taches/*");
        registrationBean.addUrlPatterns("/stagiaire-profile/*");
        registrationBean.addUrlPatterns("/supervisor/profile/*");
        //supervisor routes
        registrationBean.addUrlPatterns("/superviseur/*");
        //RH routes
        registrationBean.addUrlPatterns("/rh/*");
        //BOT routes
        registrationBean.addUrlPatterns("/bot/*");
        return registrationBean;
    }
}
