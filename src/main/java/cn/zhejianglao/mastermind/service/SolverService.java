package cn.zhejianglao.mastermind.service;

import cn.zhejianglao.mastermind.model.GuessResult;
import org.springframework.data.util.Pair;

public interface SolverService {
    String[] startNew(String ip);

    Pair<Integer, String[]> guess(GuessResult guessResult, String ip);
}
