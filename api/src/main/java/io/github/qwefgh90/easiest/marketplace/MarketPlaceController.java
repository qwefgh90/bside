package io.github.qwefgh90.easiest.marketplace;

import com.google.common.base.Charsets;
import com.google.common.hash.Hashing;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.util.Formatter;
import java.util.Map;

/**
  curl --header "Content-Type: application/json" --header "X-Hub-Signature: sadf" \
    --request POST \
    --data '{"username":"xyz","password":"xyz"}' \
    http://localhost:8080/manage/webhook
 */
@RestController
public class MarketPlaceController {
    Logger log = LoggerFactory.getLogger(MarketPlaceController.class);

    @Value("${github.webhook.secret}")
    String webhookSecret;

    @PostMapping(path="/manage/webhook")
    public ResponseEntity<Void> webhook(@RequestBody String payload, @RequestHeader("X-Hub-Signature") String secret){
        var signature = "sha1=" + calculateRFC2104HMAC(payload, webhookSecret);
        if(secret != null && signature.equals(secret)) {
            var obj = new JSONObject(payload);
            return ResponseEntity.ok().build();
        }else
            return ResponseEntity.badRequest().build();
    }

    /**
     * https://gist.github.com/ishikawa/88599/3195bdeecabeb38aa62872ab61877aefa6aef89e
     */
    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";

    private String calculateRFC2104HMAC(String data, String key)
    {
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
            mac.init(signingKey);
            return toHexString(mac.doFinal(data.getBytes()));
        }catch(NoSuchAlgorithmException | InvalidKeyException e){
            log.error("An error occurs during hashing", e);
            return "";
        }
    }

    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        return formatter.toString();
    }


}
