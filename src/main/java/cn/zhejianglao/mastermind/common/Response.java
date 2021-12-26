package cn.zhejianglao.mastermind.common;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Zefeng Wang
 */

@Data
@NoArgsConstructor
public class Response<T> {
    private int code;
    private String message;
    private T data;

    public Response(T data) {
        this.code = 0;
        this.message = "success";
        this.data = data;
    }

    public Response(int code, String message) {
        this.code = code;
        this.message = message;
        this.data = null;
    }
}
