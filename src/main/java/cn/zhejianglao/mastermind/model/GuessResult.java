package cn.zhejianglao.mastermind.model;

import lombok.Data;

/**
 * @author Zefeng Wang
 */

@Data
public
class GuessResult {
    private String[] guess;
    private int full;
    private int half;
}
