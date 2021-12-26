package cn.zhejianglao.mastermind.controller;

import cn.zhejianglao.mastermind.common.Response;
import cn.zhejianglao.mastermind.service.SolverService;
import cn.zhejianglao.mastermind.model.GuessResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Zefeng Wang
 */

@RestController
@RequestMapping("/api")
@Slf4j
public class Controller {
    @Autowired
    private SolverService solverService;

    @GetMapping("/start")
    public Response<String[]> start(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        log.info(ip + " starts a session.");
        return new Response<>(solverService.startNew(ip));
    }

    @PostMapping("/guess")
    public Response<String[]> guess(@RequestBody GuessResult guessResult, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        log.info(ip + " makes a guess.");

        final Pair<Integer, String[]> guess = solverService.guess(guessResult, ip);

        Response<String[]> response = new Response<>(guess.getSecond());
        if (guess.getFirst() == 1) {
            response.setCode(200);
        } else if (guess.getFirst() == 0) {
            response.setCode(500);
        }
        return response;
    }
}
