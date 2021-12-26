package cn.zhejianglao.mastermind.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author Zefeng Wang
 */

@Component
@Data
public class ConstantProperties {
    /*********
     * redis *
     *********/
    @Value("${redis.host}")
    private String redisHost;
    @Value("${redis.port}")
    private int redisPort;
}
