package cn.zhejianglao.mastermind.service;

import cn.zhejianglao.mastermind.model.GuessResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * @author Zefeng Wang
 */

@Service
@Slf4j
public class SolverServiceImpl implements SolverService {

    private final String[] COLOR_SET = new String[]
            {"blue", "red", "green", "yellow", "pink", "white"};

    @Autowired private RedisTemplate<String, Object> redisTemplate;

    @Override
    public String[] startNew(String ip) {
        List<String[]> bank = generateBank();
        redisTemplate.opsForValue().set(ip, bank);
        Random rand = new Random();
        return bank.get(rand.nextInt(bank.size()));
    }

    @Override
    public Pair<Integer, String[]> guess(GuessResult guessResult, String ip) {
        List<String[]> bank = (List<String[]>) redisTemplate.opsForValue().get(ip);
        Pair<Integer, Integer> result = Pair.of(guessResult.getFull(), guessResult.getHalf());
        bank = filter(guessResult.getGuess(), bank, result);
        redisTemplate.opsForValue().set(ip, bank);
        if (bank.size() == 0) {
            return Pair.of(0, new String[] {"", "", "", ""});
        }
        return Pair.of(bank.size(), generateGuess(bank));
    }

    /**
     * generate guess
     * @param bank the bank
     * @return a best guess
     */
    private String[] generateGuess(List<String[]> bank) {
        int index = 0;
        float maxScore = 0.0f;
        for (int i = 0; i < bank.size(); i++) {
            float tempScore = score(bank.get(i), bank);
            if (tempScore > maxScore) {
                index = i;
                maxScore = tempScore;
            }
        }
        return bank.get(index);
    }

    private List<String[]> filter(String[] guess, List<String[]> bank, Pair<Integer, Integer> result) {
        return bank.stream().filter(item -> compare(guess, item).equals(result)).collect(Collectors.toList());
    }

    /**
     * generate bank according to colors;
     * @return bank
     */
    private List<String[]> generateBank() {
        List<String[]> bank = new ArrayList<>();
        for (String i : COLOR_SET) {
            for (String j : COLOR_SET) {
                for (String k : COLOR_SET) {
                    for (String l : COLOR_SET) {
                        bank.add(new String[] {i, j, k, l});
                    }
                }
            }
        }
        return bank;
    }

    /**
     * compare guess and code
     * @param guess guess
     * @param code code
     * @return full true and have true
     */
    private Pair<Integer, Integer> compare(String[] guess, String[] code) {
        int full = 0;
        int half = 0;
        for (int i = 0; i < 4; i++) {
            if (guess[i].equals(code[i])) {
                ++full;
            }
        }
        for (String color : COLOR_SET) {
            int guessCount = 0;
            int codeCount = 0;
            for (String guessColor : guess) {
                if (color.equals(guessColor)) {
                    ++guessCount;
                }
            }
            for (String codeColor : code) {
                if (color.equals(codeColor)) {
                    ++codeCount;
                }
            }
            half += Math.min(guessCount, codeCount);
        }
        return Pair.of(full, half - full);
    }

    /**
     * calculate guess score
     * @param guess guess
     * @param bank bank
     * @return score
     */
    private float score(String[] guess, List<String[]> bank) {
        int[] numOccurrence = new int[15];
        for (String[] item : bank) {
            Pair<Integer, Integer> score = compare(guess, item);
            int full = score.getFirst();
            int half = score.getSecond();
            if (full == 0) {
                if (half == 0) {
                    ++numOccurrence[0];
                } else if (half == 1) {
                    ++numOccurrence[1];
                } else if (half == 2) {
                    ++numOccurrence[2];
                } else if (half == 3) {
                    ++numOccurrence[3];
                } else if (half == 4) {
                    ++numOccurrence[4];
                }
            } else if (full == 1) {
                if (half == 0) {
                    ++numOccurrence[5];
                } else if (half == 1) {
                    ++numOccurrence[6];
                } else if (half == 2) {
                    ++numOccurrence[7];
                } else if (half == 3) {
                    ++numOccurrence[8];
                }
            } else if (full == 2) {
                if (half == 0) {
                    ++numOccurrence[9];
                } else if (half == 1) {
                    ++numOccurrence[10];
                } else if (half == 2) {
                    ++numOccurrence[11];
                }
            } else if (full == 3) {
                if (half == 0) {
                    ++numOccurrence[12];
                } else if (half == 1) {
                    ++numOccurrence[13];
                }
            } else if (full == 4) {
                if (half == 0) {
                    ++numOccurrence[14];
                }
            }
        }
        int totalOccurrence = 0;
        for (Integer count : numOccurrence) {
            totalOccurrence += count;
        }
        float score = 0.0f;
        for (int count : numOccurrence) {
            if (count > 0) {
                score += (count / totalOccurrence) * Math.log(totalOccurrence / count);
            }
        }
        return score;
    }
}
