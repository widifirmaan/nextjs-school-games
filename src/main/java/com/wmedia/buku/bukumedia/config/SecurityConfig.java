package com.wmedia.buku.bukumedia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Tidak perlu lagi @Autowired untuk UserService dan PasswordEncoder di sini,
    // Spring akan otomatis menggunakannya karena sudah ada sebagai @Bean

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AccessDeniedHandler accessDeniedHandler) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/login", "/css/**", "/js/**", "/uploads/**").permitAll()
                        .requestMatchers("/guru/**").hasRole("GURU")
                        .requestMatchers("/siswa/**").hasRole("SISWA")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .failureUrl("/login?error")
                        .successHandler((request, response, authentication) -> {
                            if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_GURU"))) {
                                response.sendRedirect("/guru/dashboard");
                            } else if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SISWA"))) {
                                response.sendRedirect("/siswa/dashboard");
                            } else {
                                response.sendRedirect("/login?error");
                            }
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                .exceptionHandling(exceptions -> exceptions.accessDeniedHandler(accessDeniedHandler));
        return http.build();
    }

    // Method configureGlobal(AuthenticationManagerBuilder) tidak diperlukan lagi.
    // Spring Boot akan secara otomatis mengkonfigurasi authentication manager
    // untuk menggunakan UserDetailsService dan PasswordEncoder yang tersedia sebagai bean.

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    @Bean
    public HttpFirewall defaultHttpFirewall() {
        return new DefaultHttpFirewall();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(HttpFirewall httpFirewall) {
        return (web) -> web.httpFirewall(httpFirewall);
    }
}
